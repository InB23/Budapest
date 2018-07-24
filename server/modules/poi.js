const express = require('express');
const bodyParser = require('body-parser');
const DButilsAzure = require('./DButils');
const morgan = require('morgan');
let router = express.Router();


router.put('/setPoiAvgRank', function (req, res) {
    let poiName = req.body.poiName;
    let query = `SELECT AVG(userRank) as AVG FROM UsersReviewTbl Where poiNameFk = '${poiName}'`;

    DButilsAzure.execQuery(query).then((result) => {
        let updateQuery = `UPDATE PointsOfInterestTbl SET poiRank = '${result[0].AVG}' WHERE poiName = '${poiName}'`;
        DButilsAzure.execQuery(updateQuery).then((result) => {
            res.send(true);
        })
    })
});

router.get('/poiReviews/:poiName', function (req, res) {
    let poiName = req.params.poiName;
    let query = `SELECT userReview FROM UsersReviewTbl WHERE poiNameFk='${poiName}'`;

    DButilsAzure.execQuery(query).then((result) => {

        res.send(result);
    });
});


/********************************************************/

router.get('/get3RandomPoPularPOI', function (req, res) {

    let query = `SELECT poiName FROM PointsOfInterestTbl`;

    DButilsAzure.execQuery(query).then((result) => {
        let usedNumbers = new Array(3);
        let poiArray = new Array(3);
        let randomNumber = 0;
        let counter = 0;
        while (counter < 3) {
            randomNumber = Math.floor((Math.random() * result.length));
            /* In case we didn't use the number */
            if (-1 === usedNumbers.indexOf(randomNumber)) {
                usedNumbers[counter] = randomNumber;
                poiArray[counter] = (result[usedNumbers[counter]]);
                counter++;
            }
        }
        res.send(poiArray);
    });
});



router.get('/getPoiNameImageViewsRankCat', function (req, res) {
    let query = `SELECT categoryNameFk,poiName,poiViews,poiRank,poiImage FROM PoiCategoriesTbl INNER JOIN PointsOfInterestTbl ON PoiCategoriesTbl.poiNameFk=PointsOfInterestTbl.poiName`;
    DButilsAzure.execQuery(query).then((result) => {
        res.send(result)
    });
});


router.get('/getPoiImage/:poiName', function (req, res) {
    let reqPoiName = req.params.poiName;
    let query = `SELECT poiImage FROM PointsOfInterestTbl WHERE poiName='${reqPoiName}'`;
    DButilsAzure.execQuery(query).then((result) => {
        res.send(result)
    });
});

router.get('/getPoiArrByCat/:categoryName', function (req, res) {
    let categoryName = req.params.categoryName;
     let query = `SELECT categoryNameFk,poiName,poiViews,poiRank,poiImage FROM PoiCategoriesTbl INNER JOIN PointsOfInterestTbl ON PoiCategoriesTbl.poiNameFk=PointsOfInterestTbl.poiName WHERE categoryNameFk='${categoryName}'`;
    DButilsAzure.execQuery(query).then((result) => {
        res.send(result)
    });
});

router.get('/getCategories/', function (req, res) {
    let query = `SELECT DISTINCT categoryNameFk FROM PoiCategoriesTbl`;
    DButilsAzure.execQuery(query).then((result) => {
        res.send(result)
    });
});

router.get('/:poiName', function (req, res) {
    let poiName = req.params.poiName;
    let updateViewCountQuery = `UPDATE PointsOfInterestTbl SET poiViews = poiViews + 1 WHERE poiName = '${poiName}'`;
    DButilsAzure.execQuery(updateViewCountQuery).then((result) => {
        let getPoiQuery = `SELECT * FROM PointsOfInterestTbl WHERE poiName='${poiName}'`;
        DButilsAzure.execQuery(getPoiQuery).then((result) => {
            res.send(result)
        });
    }).catch(err => res.send({
        status: 404,
        message: 'poi: ' + poiName + ' was not found'
    }));
});


/* Export the module */
module.exports = router;


/* End Of File */
