var mysql = require('mysql');
var config = require('./config');

var connection;

module.exports.connect = function () {
    connection = mysql.createConnection(config.dbData);

    connection.connect(connectionError);

    return connection;
};

module.exports.getUser = function (id, succes) {
    console.log('user is requested');

    var sqlquery = 'SELECT * FROM users where id = ' + id + ';';

    query(sqlquery, succes);
};

module.exports.getWines = function (succes) {
    console.log('Wines are requested');

    var sqlquery = 'SELECT * FROM wines;';

    query(sqlquery, succes);
};

module.exports.getWineColumns = function (succes) {
    console.log('WineColumns are requested');

    var sqlquery = 'SHOW COLUMNS FROM wines';

    query(sqlquery, succes);
};

module.exports.getProeverijen = function (succes) {
    console.log('Proeverijen are requested');

    var sqlquery = 'SELECT * FROM proeverijen';

    query(sqlquery, succes);
};

module.exports.getProeverijenID = function (succes) {
    console.log("Id's of proeverijen are requested");

    var sqlquery = 'SELECT id FROM proeverijen';

    query(sqlquery, succes);
};

module.exports.getProeverij = function (id, succes) {
    console.log("Proeverij with id: " + id + " is requested");

    var sqlquery = 'SELECT * FROM proeverijen WHERE id = ' + id;

    query(sqlquery, succes);
};

function query(query, succes) {
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error while performing query: ' + err.message);
        } else {
            succes(rows, fields);
        }
    });
}

function connectionError(err) {
    if (err) {
        console.error('<<<Error connecting to database>>>');
        console.error(err.message);
        return;
    }
    console.log('>>>>Connection to ' + config.dbData.database + ' database established<<<<');
}