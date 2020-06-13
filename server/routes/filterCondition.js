var express = require('express');
var mysql = require('mysql');
var filterConditionRouter = express.Router();

function queryAreas(db, res) {
    
    
    db('offences').select('area').groupBy('area')
    .then((rows) => {
      let outputData = [];
      rows.forEach(element => {
        outputData.push(element.area);
       });
      res.json({error: false, result: outputData});
    })
    .catch((err) => {
      res.status(400);
      res.json({error: true, message: 'Bad request'});
    })

    
}
  
function queryGenders(db, res) {
    db('offences').select('gender').groupBy('gender')
    .then((rows) => {
      let outputData = [];
      rows.forEach(element => {
        outputData.push(element.gender);
       });
      console.log(rows);
      res.json({error: false, result: outputData});
    })
    .catch((err) => {
      res.status(400);
      res.json({error: true, message: 'Bad request'});
    })
}
  
function queryAges(db, res) {
    db.from('offences').select('age').groupBy('age')
    .then((rows) => {
      let outputData = [];
      rows.forEach(element => {
        outputData.push(element.age);
       });
      res.json({error: true, result: outputData});
    })
    .catch((err) => {
      res.status(400);
      res.json({error: true, message: 'Bad request'});
    })
}  

function queryYears(db, res) {
    db.from('offences').select('year').groupBy('year')
    .then((rows) => {
      let outputData = [];
      rows.forEach(element => {
        outputData.push(element.year);
       });
      res.json({error: true, result: outputData});
    })
    .catch((err) => {
      res.status(400);
      res.json({error: true, message: 'Bad request'});
    })
}

filterConditionRouter.get('/areas', function(req, res, next) {
    console.log('a');
    res.setHeader('Access-Control-Allow-Origin', '*');
    queryAreas(req.db, res);
});
  
filterConditionRouter.get('/genders', function(req, res, next) {
    console.log('a');
    res.setHeader('Access-Control-Allow-Origin', '*');
    queryGenders(req.db, res);
});
  
filterConditionRouter.get('/ages', function(req, res, next) {
    console.log('a');
    res.setHeader('Access-Control-Allow-Origin', '*');
    queryAges(req.db, res);
});
  
filterConditionRouter.get('/years', function(req, res, next) {
    console.log('b');
    res.setHeader('Access-Control-Allow-Origin', '*');
    queryYears(req.db, res);
});

module.exports = filterConditionRouter;