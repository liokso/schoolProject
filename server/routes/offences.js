var express = require('express');
var mysql = require('mysql');
var offencesRouter = express.Router();

function queryOffences(db, res) {
    let outputData = [];

    db.from('offence_columns').select("pretty")
    .then((rows) => {
      rows.forEach(element => {
        outputData.push(element['pretty']);
      });
      res.json({error: false, message: "success", offences: outputData});
    })
    .catch((err) => {
      res.status(500)
      res.json({error: true, message: "Server Error"})
    })

}

offencesRouter.get('/', function(req, res, next) {
    //console.log(req);
    res.setHeader('Access-Control-Allow-Origin', '*'); //http://localhost:3000
    queryOffences(req.db, res);
});

module.exports = offencesRouter;