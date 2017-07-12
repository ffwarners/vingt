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

config.delimiter = '+----------+';

module.exports = config;