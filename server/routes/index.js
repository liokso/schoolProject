var express = require('express');

var router = express.Router();


router.get('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send("Use /docs to view api interfaces");
});


module.exports = router;
