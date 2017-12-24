// External modules
var express = require('express');
var bodyParser = require('body-parser');
var passport   = require('passport');
var session    = require('express-session');
var flash      = require('connect-flash');

// Our own modules
var logger = require('./logger');
var routes = require('./routes');
var authentication = require('./authentication');
var config = require('./config');
var connection = require('./databaseHandler').connect();

// configure the passport
authentication(passport, connection);

// create the app
var app = express();

// Extends the limit so there won't be a too large request entity anymore
app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000
}));

app.use(express.static(config.staticPath));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

// set the logger component
app.use(logger);

// use passport authentication
app.use(session(config.sessionOptions));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash());

// Set all the routes
routes(app, passport, connection);

// 404 not found
app.use(function(req, res) {
    console.log('404 not found');

    res.status(404);
    res.render('public/404', {url: req.url});
});

// create the server
app.listen(config.PORT, function () {
    console.log("Server listening on: http://%s:%s", require('ip').address(), config.PORT);
});