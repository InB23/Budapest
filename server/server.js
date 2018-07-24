/* Load Modules */
const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const xml2js = require('xml2js');
const fs = require('fs');
const DButilsAzure = require('./modules/DButils');
const ConnectionPool = require('tedious-connection-pool');
const jwt = require('jsonwebtoken');
const superSecret = "InbarYagil";
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");

    next();
});

/* Handle poi module */
let poi = require('./modules/poi'); // Load the js file
app.use('/poi', poi); // Whenever a call to poi URI is made, the middleware poi.js will handle the request


/* Handle poi module */
let user = require('./modules/user'); // Load the js file
app.use('/user', user); // Whenever a call to poi URI is made, the middleware poi.js will handle the request


app.get('/', function (req, res) {
    res.send('Welcome to my page!');
});

app.get('/getCountries', function (req, res) {
    let parser = new xml2js.Parser(); // Creating XML to JSON parser object
    fs.readFile(__dirname + '/countries.xml', function (err, data) {
        parser.parseString(data, function (err, result) {
            res.send(result);
        });
    });
});

app.get('/getCategories', function (req, res) {
    let query = `SELECT * FROM CategoriesTbl`;
    DButilsAzure.execQuery(query).then((result) => {
        res.send(result)
    });
});

app.post('/register', function (req, res) {

    let query1 = "IF NOT EXISTS (SELECT userPassword FROM UsersTbl WHERE userUsername= \'" + req.body.userUsername + "\' ) SELECT 0 AS userPassword ELSE SELECT userPassword FROM UsersTbl WHERE userUsername= \'" + req.body.userUsername + "\'";
    DButilsAzure.execQuery(query1)
        .then(function (ans) {

            if (!(0 === ans[0].userPassword)) {
                return Promise.reject('User already exists');
            }
            let query2 = "INSERT INTO UsersTbl (userUsername,userFirstName,userLastName,userCity,userCountry,userMailAddress,userPassword)" +
                " VALUES(\'" + req.body.userUsername + "\', \'" + req.body.userFirstName + "\',\'" + req.body.userLastName + "\',\'" + req.body.userCity + "\',\'" + req.body.userCountry + "\',\'" + req.body.userMailAddress + "\',\'" + req.body.userPassword + "\')";

            DButilsAzure.execQuery(query2)
                .then(function (ans) {

                    addUserCategories(JSON.parse(req.body.userCategories), req.body.userUsername);
                    addUserQuestions(req.body.userUsername, req.body.question1, req.body.firstAnswer);
                    addUserQuestions(req.body.userUsername, req.body.question2, req.body.secondAnswer);

                    res.status(200).res.send({
                        "userName": req.body.userUsername,
                        "password": req.body.userPassword
                    });
                    res.end();
                })
                .catch(err => res.send(err));
        })
        .catch(err => res.send(err));

});

function addUserCategories(userCategoryArray, userUsername) {
    console.log("here");
    console.log(userCategoryArray);


    for (let i = 0; i < userCategoryArray.length; i++) {
        console.log("here1");

        console.log("userCategoryArray[i] is:" + userCategoryArray[i]);
        let query = "INSERT INTO UserCategoriesTbl (userCategoryFk, userUsernameFK) Values (\'" + userCategoryArray[i] + "\',\'" + userUsername + "\')";
        DButilsAzure.execQuery(query);
    }
    console.log("here2");

    return true;
}

function addUserQuestions(userName, questions, answers) {

    let query = "INSERT INTO UserQuestionsTbl (userUsernameFK, userQuestionFK, userAnswer) Values (\'" + userName + "\',\'" + questions + "\',\'" + answers + "\')";
    DButilsAzure.execQuery(query);
}


app.post('/getUserCurrentPassword', function (req, res) {
    DButilsAzure.execQuery("SELECT userAnswer FROM UserQuestionsTbl where userUsernameFk=\'" + req.body.username + "\' AND userQuestionFk=\'" + req.body.Question1 + "\'")
        .then(function (ans) {
            if (!(ans[0].userAnswer === req.body.answer1)) {
                res.send('answers not correct, try again');
            }
            else {
                DButilsAzure.execQuery("SELECT userAnswer FROM UserQuestionsTbl where userUsernameFk=\'" + req.body.username + "\' AND userQuestionFk=\'" + req.body.Question2 + "\'").then(function (ans) {
                    if (!(ans[0].userAnswer === req.body.answer2)) {
                        res.send('answers not correct, try again');
                    }
                    else {
                        DButilsAzure.execQuery("SELECT userPassword FROM UsersTbl WHERE userUsername=\'" + req.body.username + "\'")
                            .then(function (ans) {
                                res.send(ans);
                            })
                            .catch(err => res.send(err));
                    }
                })
                    .catch(err => res.send(err));

            }
        })
        .catch(err => res.send(err));
});

app.post('/getUserQuestion', function (req, res) {

    let query1 = "IF NOT EXISTS (SELECT userQuestionFk FROM UserQuestionsTbl WHERE userUsernameFk= \'" + req.body.username + "\' ) SELECT 0 AS userQuestionFk ELSE SELECT userQuestionFk FROM UserQuestionsTbl WHERE userUsernameFk= \'" + req.body.username + "\'";

    DButilsAzure.execQuery(query1)
        .then(function (ans) {
            if ((0 === ans[0].userQuestionFk)) {
                res.send('User not exist');
            } else {
                res.send(ans);
            }
        });
});


app.post('/login', function (req, res) {
    let userToCheck = req.body;
    if (!userToCheck) {
        res.end();
    }

    //let query= "SELECT ISNULL(P.userPassword, 0) as userPassword FROM UsersTbl as P RIGHT JOIN (SELECT 1 as userUsername) as PROD ON P.userUsername = Prod.userUsername and P.userUsername =\'" + req.body.user + "\'";
    let query = "IF NOT EXISTS (SELECT userPassword FROM UsersTbl WHERE userUsername= \'" + req.body.user + "\' ) SELECT 0 AS userPassword ELSE SELECT userPassword FROM UsersTbl WHERE userUsername= \'" + req.body.user + "\'";
    //let query= "SELECT userPassword FROM UsersTbl WHERE userUsername=\'" + req.body.user + "\'";

    DButilsAzure.execQuery(query)
        .then(function (ans) {
                console.log(ans[0]);

                if (0 === ans[0].userPassword) {
                    //res.status(403).end();
                    return Promise.reject('Wrong Username');
                }
                else if (!(ans[0].userPassword === req.body.pass)) {
                    //res.status(403).end();
                    return Promise.reject('Wrong Password');
                }
                let userName = {
                    userName: req.body.user
                };
                let token = jwt.sign(userName, superSecret, {
                    expiresIn: "1d" // expires in 24 hours
                });
                // return the information including token as
                JSON
                res.json({
                    token: token
                });
                res.status(200);
                res.end();
            }
        )
        .catch(ans => res.send("" + ans));
});

//--DatabaseConnection-----------------------------------------------------------------------------------------------

const port = 3030;
const poolConfig = {
    min: 2,
    max: 1500,
    log: true,
};

// const connectionConfig = {
//     userName: 'yagilo@internetprogramming',
//     password: 'qwerty123456Q#',
//     server: 'internetprogramming.database.windows.net',
//     options: {encrypt: true, database: 'myDB_Yagil'},
// };
//
// let pool = new ConnectionPool(poolConfig, connectionConfig);
//
// pool.on('error', function (err) {
//     if (err) {
//         console.log(err);
//         reject(err);
//     }
// });

//-------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------------------------
let server = app.listen(port, function () {
    let port = server.address().port;
    console.log("Listening on port '%s'", port);
});
//-------------------------------------------------------------------------------------------------------------------





