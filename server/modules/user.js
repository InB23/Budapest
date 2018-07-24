const superSecret = "InbarYagil";
const express = require('express');
const bodyParser = require('body-parser');
const DButilsAzure = require('./DButils');
const jwt = require('jsonwebtoken');
let router = express.Router();


router.use('/', function (req, res, next) {

    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token'});
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                let decoded = jwt.decode(token, {complete: true});
                req.userUsername = decoded.payload.userName;
                next();
            }
        });

    } else {
        return res.status(403).send({
            status: 403,
            message: 'Error! token not valid'
        });
    }
});

router.post('/getUser2PopularPoiByCat', function (req, res) {
    let username = req.body.userUsername;
    console.log("username:" + username);

    DButilsAzure.execQuery(`SELECT TOP 2 userCategoryFk FROM UserCategoriesTbl WHERE userUsernameFk='${username}'`)
        .then(function (ans) {
            let twoCategories = ans;
            console.log("finish query");

            DButilsAzure.execQuery(`SELECT TOP 1 * FROM PoiCategoriesTbl INNER JOIN PointsOfInterestTbl ON PoiCategoriesTbl.poiNameFk=PointsOfInterestTbl.poiName WHERE PoiCategoriesTbl.categoryNameFk= '${twoCategories[0].userCategoryFk}' ORDER BY poiViews DESC`)
                .then(function (ans) {
                    let ans1 = [];
                    ans1[0] = ans[0];

                    DButilsAzure.execQuery(`SELECT TOP 1 * FROM PoiCategoriesTbl INNER JOIN PointsOfInterestTbl ON PoiCategoriesTbl.poiNameFk=PointsOfInterestTbl.poiName WHERE PoiCategoriesTbl.categoryNameFk= '${twoCategories[1].userCategoryFk}' ORDER BY poiViews DESC`)
                        .then(
                            ans => res.send(ans1.concat(ans[0]))
                        )
                        .catch(err => res.send(err));

                })
                .catch(err => res.send(err));
        })
        .catch(err => res.send(err));

});

router.post('/getUserSavedPOI', function (req, res) {
    let user = req.userUsername;
    let query = `SELECT poiNameFk FROM PoiOfUsersTbl WHERE userUsernameFk='${user}'`;
    DButilsAzure.execQuery(query).then(function (ans) {
        res.send(ans);
    });
});

router.delete('/deleteUserPoiArray', function (req, res) {
    let userDeletePoiArray = req.body.poiArrayToDelete;
    let username = req.userUsername;

    for (let i = 0; i < userDeletePoiArray.length; i++) {
        let query = "DELETE FROM PoiOfUsersTbl WHERE userUsernameFk=\'" + username + "\'" + "AND poiNameFk=\'" + userDeletePoiArray[i] + "\'";
        DButilsAzure.execQuery(query).catch((result) => {
            res.send(result)
        });
    }
    res.send({
        status: 200,
        message: true
    })
});

router.post('/addReviewToPoi', function (req, res) {
    let username = req.userUsername;
    let poiName = req.body.poiName;
    let poiReviewText = req.body.poiReviewText;
    let date = req.body.date;
    let poiReviewRank = req.body.poiReviewRank;

    let isRevExistQuery = `SELECT poiNameFk FROM UsersReviewTbl WHERE userUsernameFk = '${username}' AND poiNameFk = '${poiName}'`;
    DButilsAzure.execQuery(isRevExistQuery).then((result) => {
        if (result.length > 0) {
            console.log(result);
            res.send({status: false, message: "Point of view already exists"});
        }
        else {
            let query = `INSERT INTO UsersReviewTbl VALUES('${username}', '${poiReviewText}', '${poiName}', '${date}', ${poiReviewRank})`;
            DButilsAzure.execQuery(query).then(function (result) {
                console.log(result);
                updatePoiRank(poiName);
                res.send(true);
            }).catch(function (result) {
                console.log(result);
                res.send({status: false, message: "Point of view already exists or bad input"});
            });
        }
    })
});

function updatePoiRank(poiName) {
    let query = `SELECT AVG(userRank) as AVG FROM UsersReviewTbl Where poiNameFk = '${poiName}'`;
    DButilsAzure.execQuery(query).then((result) => {
        let updateQuery = `UPDATE PointsOfInterestTbl SET poiRank = '${result[0].AVG}' WHERE poiName = '${poiName}'`;
        DButilsAzure.execQuery(updateQuery).then((result) => {
            return true;
        })
    })
}

router.post('/getUserPoiArray', function (req, res) {
    let username = req.userUsername;
    let query = `SELECT * FROM PointsOfInterestTbl JOIN PoiOfUsersTbl ON PointsOfInterestTbl.poiName=PoiOfUsersTbl.poiNameFk WHERE PoiOfUsersTbl.userUsernameFk='${username}'`;

    DButilsAzure.execQuery(query).then((result) => {
        res.send(result);
    });
});

router.post('/getUserQuestion', function (req, res) {
    let username = req.userUsername;
    DButilsAzure.execQuery("SELECT TOP 1 userQuestionFk FROM UserQuestionsTbl WHERE userUsernameFk=\'" + username + "\'" + " ORDER BY NEWID()")
        .then(function (ans) {
            if (0 === ans.length) {
                return Promise.reject('Wrong Username');
            } else {
                res.send(ans);
            }
        });
});

router.post('/getUserPoiSize', function (req, res) {
    let username = req.userUsername;
    let query = `SELECT COUNT(*) AS UserPoiArraySize FROM PointsOfInterestTbl JOIN PoiOfUsersTbl ON PointsOfInterestTbl.poiName=PoiOfUsersTbl.poiNameFk WHERE PoiOfUsersTbl.userUsernameFk='${username}'`;

    DButilsAzure.execQuery(query).then((result) => {
        res.send(result);
    });
});

router.post('/addUserPoiArray', function (req, res) {
    let username = req.userUsername;
    let poiNameArray = req.body.poiNameArray;
    let poiNamePriorityArray = req.body.priority;

    if (typeof poiNamePriorityArray !== 'undefined' && poiNamePriorityArray) {
        for (let i = 0; i < poiNameArray.length; i++) {
            let checkPoiQuery = `SELECT * FROM PoiOfUsersTbl WHERE userUsernameFk = '${username}' , poiNameFk = '${poiNameArray[i]}'`;
            DButilsAzure.execQuery(checkPoiQuery).then((result) => {
                if (result.length > 0)
                    res.send({message: "Point of view " + poiNameArray[i] + " already exists"});
                else {
                    let query = "INSERT INTO PoiOfUsersTbl (userUsernameFk, poiNameFk, userPoiPriority, userSavePoiDate) VALUES (\'" + username + "\',\'" + poiNameArray[i] + "\'" + "," + poiNamePriorityArray[i] + "," + " GETDATE())";
                    DButilsAzure.execQuery(query)
                        .then(function (result) {
                        }).catch(function (error) {
                        console.log(error);
                        res.send({status: "Failed", message: "Point of view " + poiNameArray[i] + " wasn't added"});
                    })
                }
            })
        }
    }
    else {
        for (let i = 0; i < poiNameArray.length; i++) {
            let checkPoiQuery = `SELECT * FROM PoiOfUsersTbl WHERE userUsernameFk = '${username}' AND poiNameFk = '${poiNameArray[i]}'`;
            DButilsAzure.execQuery(checkPoiQuery).then((result) => {
                if (result.length > 0)
                    res.send({message: "Point of view " + poiNameArray[i] + " already exists"});
                else {
                    let query = "INSERT INTO PoiOfUsersTbl (userUsernameFk, poiNameFk, userPoiPriority, userSavePoiDate) VALUES (\'" + username + "\',\'" + poiNameArray[i] + "\'" + "," + i + "," + " GETDATE())";
                    DButilsAzure.execQuery(query)
                        .then(function (result) {
                            console.log(result);
                        }).catch(function (error) {
                        console.log(error);
                        res.send({status: "Failed", message: "Point of view " + poiNameArray[i] + " wasn't added"});
                    })
                }
            })
        }
    }
    res.send({status: "Success", message: "All points were added to favorites list"});
});


// for (let i = 0; i < poiNameArray.length; i++) {
//     let checkPoiQuery = `SELECT * FROM PoiOfUsersTbl WHERE userUsernameFk = '${username}' , poiNameFk = '${poiNameArray[i]}'`;
//     DButilsAzure.execQuery(checkPoiQuery).then((result) => {
//         if (result.length > 0)
//             res.send({message: "Point of view " + poiNameArray[i] + " already exists"});
//         else {
//             let maxQuery = "SELECT MAX(userPoiPriority) FROM PoiOfUsersTbl WHERE userUsernameFk=\'" + username + "\' AND poiNameFk='" + poiNameArray[i] + "' GROUP BY userUsernameFk AND poiNameFk";
//             DButilsAzure.execQuery(maxQuery)
//                 .then(function (priority) {
//                     let query = "INSERT INTO PoiOfUsersTbl (userUsernameFk, poiNameFk, userPoiPriority, userSavePoiDate) VALUES (\'" + username + "\',\'" + poiNameArray[i] + "\'" + "," + priority + "," + " GETDATE())";
//                     DButilsAzure.execQuery(query)
//                         .then(ans => res.send(true))
//                         .catch(err => res.send(err));
//                 })
//         }
//     })
// }

router.post('/getLastTwoSavedPoi', function (req, res) {
    let username = req.userUsername;
    let query = `SELECT TOP 2 PointsOfInterestTbl.poiName, poiViews,poiDescription, poiRank, poiImage FROM PoiOfUsersTbl INNER JOIN PointsOfInterestTbl ON PoiOfUsersTbl.poiNameFk=PointsOfInterestTbl.poiName WHERE userUsernameFk='${username}' ORDER BY userSavePoiDate DESC`;
    DButilsAzure.execQuery(query).then(function (ans) {
        res.send(ans);
    });
});


/* Export the module */
module.exports = router;


/* End Of File */
