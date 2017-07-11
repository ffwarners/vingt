// External modules
var express = require('express');
var bodyParser = require('body-parser');

// Our own modules
var logger = require('./logger');
var routes = require('./routes');
var config = require('./config');
var connection = require('./databaseHandler').connect();

// create the app
var app = express();
app.use(express.static(config.staticPath));

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

// set the logger component
app.use(logger);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Set all the routes
routes(app, connection);

// 404 not found
app.use(function(req, res) {
    console.log('404 not found');

    res.status(404);
    res.render('404', {url: req.url});
});

// create the server
app.listen(config.PORT, function () {
    console.log("Server listening on: http://%s:%s", require('ip').address(), config.PORT);
});