var router = require('express').Router();

var dbHandler = require('./databaseHandler');
var config = require('./config');

// connect to mysql
var connection;

module.exports = function (app, Connection) {
    connection = Connection;

    router.get('/cookies', function (req, res) {
        console.log("++ unsigned cookies ++");
        console.log(req.cookies);
        console.log("++ signed cookies ++");
        console.log(req.signedCookies);
        res.render('404');
        res.end();
    });

    router.get('/session', function (req, res) {
        console.log("++ session ++");
        console.log(req.session);
        res.render('404');
        res.end();
    });

    router.get('/', home);

    app.use(router);
};

function home(req, res) {
    res.sendFile(__dirname + '/views/home.html');
}