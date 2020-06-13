var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var https = require('https');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var offencesRouter = require('./routes/offences');
var filterConditionRouter = require('./routes/filterCondition');
var searchRouter = require('./routes/search');
var advanceFilterRouter = require('./routes/advanceFilter');

const fs = require('fs');
const privateKey = fs.readFileSync('/etc/ssl/private/node-selfsigned.key','utf8');
const certificate = fs.readFileSync('/etc/ssl/certs/node-selfsigned.crt','utf8');
const credentials = {
	key: privateKey,
	cert:certificate
};

const options = require('./database/knexconfig.js');
const knex = require('knex')(options);

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const helmet = require('helmet')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(helmet());

app.use((req, res, next) => {
  req.db = knex
  next()
})

app.use(logger('common'));
logger.token('req', (req, res) => JSON.stringify(req.headers))
logger.token('res', (req, res) => {
	const headers = {}
	res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
	return JSON.stringify(headers)
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/offences', offencesRouter);
app.use('/search', searchRouter);
app.use('/filter', filterConditionRouter);
app.use('/advanceFilter', advanceFilterRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = https.createServer(credentials, app);
server.listen(443);

module.exports = app;
