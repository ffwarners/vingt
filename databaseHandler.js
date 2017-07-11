/**
 * Created by Steven on 11-7-2017.
 */

var mysql = require('mysql');
var config = require('./config');

var connection;

module.exports.connect = function () {
    connection = mysql.createConnection(config.dbData);

    connection.connect(connectionError);

    return connection;
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