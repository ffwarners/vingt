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
    router.get('/about-us.html', aboutUs);
    router.get('/blog.html', blog);
    router.get('/contact-us.html', contact);
    router.get('/index.html', home);
    router.get('/portfolio.html', portfolio);
    router.get('/services.html', service);

    app.use(router);
};

function home(req, res) {
    res.sendFile(__dirname + '/views/home.html');
}

function aboutUs(req, res) {
    res.sendFile(__dirname + '/views/about-us.html');
}

function blog(req, res) {
    res.sendFile(__dirname + '/views/blog.html');
}

function contact(req, res) {
    res.sendFile(__dirname + '/views/contact-us.html');
}

function portfolio(req, res) {
    res.sendFile(__dirname + '/views/portfolio.html');
}

function service(req, res) {
    res.sendFile(__dirname + '/views/services.html');
}