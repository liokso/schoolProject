var express = require('express');
var jwt = require('jsonwebtoken');
var userRouter = express.Router();
var bcrypt = require('bcryptjs');

let secrit = 'pppqqq';

function queryUser(email, passwd, db, res) {
  db.from('users').select("*").where('email','=', email)
  .then((rows) => {
    if (bcrypt.compareSync(passwd, rows[0].password)) {
   	 var newToken = jwt.sign({id: rows[0].email}, secrit, {
     		 expiresIn: 86400 // expires in 24 hours
   	 });
    	res.json({message: "successful", token: newToken});
    }
    else {
	    res.status(401);
	    res.json({"Error":true, "Message": "Email or password wrong"})
	  }
  })
  .catch((err) => {
    console.log(err)
    res.status(401)
    res.json({"Error": true, "Message": "Email or password wrong"})
  })
}

function createUser(email, passwd, db, res) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(passwd, salt);
  db('users').insert({email: email, password: hash})
  .then((rows) => {
    var newToken = jwt.sign({id: email}, secrit, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(201)
    res.json({message: "successful", token: newToken});
  })
  .catch((err) => {
    res.status(400)
    res.json({"Error": true, "Message": "User already exists"})
  })
}

userRouter.post('/login', function(req, res, next) {
  queryUser(req.body.email, req.body.password, req.db, res);
  res.setHeader('Access-Control-Allow-Origin', '*'); //http://localhost:3000
});

userRouter.post('/register', function(req, res, next) {
  createUser(req.body.email, req.body.password, req.db, res);
  res.setHeader('Access-Control-Allow-Origin', '*'); //http://localhost:3000  
});

module.exports = userRouter;
