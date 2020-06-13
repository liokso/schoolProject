var express = require('express');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
let secrit = 'pppqqq';
var advanceFilterRouter = express.Router();
var formatCondition = require('../utils/formatCondition');

/**
 * construct array from data
 * @param {*} data 
 */
function constructDataArray(data) {
    if (data.length > 0) {
      const dataArray = data.split(',');
      return dataArray;
    }
    return "";
  }

/**
 * generate offences condition based on knex
 * @param {*} innerDB knex object
 * @param {*} conditionArray offence condition array
 */
function offencesCondition(innerDB, conditionArray) {
  for (let i = 0; i < conditionArray.length; i++) {
    innerDB = innerDB.orWhere(formatCondition(conditionArray[i]), '>', '0')
  }
  return innerDB;
}

/**
 * generate areas condition based on knex
 * @param {*} innerDB knex object
 * @param {*} areaArray areas condition array
 */
function areaConditionAdded(innerDB, areaArray) {
  for (let i = 0; i < areaArray.length; i++) {
    innerDB = innerDB.orWhere('area', '=', areaArray[i])
  }
  return innerDB;
}

/**
 * generate sum operation
 * @param {*} knex knex object
 * @param {*} conditionArray conditions
 */
function sumGenerator(knex, conditionArray) {
  
  conditionArray.map((element) => {
    let object = {}
    object[formatCondition(element)] = formatCondition(element)
    knex = knex.sum(object)
  })

  return knex
}

function queryAdvanceSearch(db, res, gender, age, yearArray, areaArray, conditionArray) {

    // db.on('query', function(queryData) {
    //   console.log(queryData);
    // });

    let whereS = {}

    if (gender != '') {
      whereS['gender'] = gender;
    }

    if (age != '') {
      whereS['age'] = age;
    }

    let tempValue = db("offences").select('area', 'age', 'gender', 'year')
    tempValue = sumGenerator(tempValue, conditionArray)

    tempValue.where(whereS)
    .whereBetween('year', yearArray).andWhere((innerDB) => offencesCondition(innerDB, conditionArray))
    .andWhere((innerDB) => areaConditionAdded(innerDB, areaArray))   
    .groupBy('area','gender','age', 'year')
    .then((rows) => {
      //res.json({message: 't'})
      let outputData = [];
      rows.map((element) => {
        outputData.push(Object.values(element));
      });
      res.json({error: false, result: outputData});
    })
    .catch((err) => {
      res.status(400);
      res.json({error: true, message: 'Bad Request'})
    })

}

/**
 * Construct year range
 * @param {*} year1 
 * @param {*} year2 
 */
function constructYearRange(year1, year2) {
  const year1Value = parseInt(year1);
  const year2Value = parseInt(year2);

  if (year1 === '' && year2 === '') {
    return [0, 9999]
  }
  else if (year2 !== '' && year1 === '') {
    return [year2Value, year2Value]
  }
  else if (year2 === '' && year1 !== '') {
    return [year1Value, year1Value]
  }
  else {
    if (year1Value > year2Value) {
      return [year2Value, year1Value]
    }
    else {
      return [year1Value, year2Value]
    }
  } 
}

advanceFilterRouter.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //http://localhost:3000  
    const token = req.header('Authorization');
    jwt.verify(token, secrit, function(err, decode) {
      if (err) {
        return res.status(401).send({error: true, message: 'Authorization faile'});
      }
      
    });
    const areas = constructDataArray(req.query.areas);
    const offences = constructDataArray(req.query.offences);
  
    const gender = req.query.gender;
    const age = req.query.age;
    const year1 = req.query.year1;
    const year2 = req.query.year2;

  
    queryAdvanceSearch(req.db, res, gender, age, constructYearRange(year1, year2), areas, offences); //[0, 9999]
});

advanceFilterRouter.options('/', function(req, res, next) {

    res.setHeader('Access-Control-Allow-Headers', 'authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    next();
});

module.exports = advanceFilterRouter;
