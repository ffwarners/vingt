var config = {};

config.PORT = 3000;
config.staticPath = __dirname + "/client";
config.dbData = {
    host: 'localhost',
    port: 3306,
    user: 'Wijn',
    password: 'Vingt',
    database: 'wines'
};

config.sessionOptions = {
    secret: 'hellowhatdoesthismean',
    resave: true,
    saveUninitialized: true
};

config.loginOptions = {
    successRedirect : '/adaptKaart',
    failureRedirect : '/login',
    failureFlash : true
};

config.strategyOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

config.delimiter = '+----------+';

module.exports = config;