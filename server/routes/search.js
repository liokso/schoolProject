var express = require('express');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
let secrit = 'pppqqq';
var searchRouter = express.Router();
var formatCondition = require('../utils/formatCondition');

function querySearch(db, condition, res) {
    const pureCondition = formatCondition(condition)
    // db.on('query', function(queryData) {
    // 	console.log(queryData)
    // })
    db({t1: 'offences', t2: 'areas'}).select('t1.area','t2.lat','t2.lng').sum({summation: pureCondition})
    .whereRaw('??=??',['t1.area','t2.area']).groupBy('t1.area')
    .then((rows) => {
      let outputData = [];
      rows.forEach(element => {
        outputData.push({
          LGA: element.area,
          total: element.summation,
          lat: element.lat,
          lng: element.lng
        });
       });
       res.json({error: false, result: outputData});
    })
    .catch((err) => {
      res.status(400);
      res.json({error: true, message: "request offence parameters wrong"});
    })
}

searchRouter.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //http://localhost:3000  
    const token = req.header('Authorization');
    jwt.verify(token, secrit, function(err, decode) {
     if (err) {
       return res.status(401).send({error: true, message: 'Authorization faile'});
     }
  
    querySearch(req.db, req.query.offence, res);
  });
});
  
searchRouter.options('/', function(req, res, next) {
  
    res.setHeader('Access-Control-Allow-Headers', 'authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    next();
});

module.exports = searchRouter;
