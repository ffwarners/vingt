var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');

var config = require('./config');
var connection;

module.exports = function (passport, Connection) {

    connection = Connection;

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM users WHERE id = ?;", [id], function (err, rows) {
            done(err, rows[0]);
        });
    });

    passport.use('local-login', new LocalStrategy(config.strategyOptions, function (req, username, password, done) {
        connection.query("SELECT * FROM users WHERE username = ?;", [username], function (err, rows) {
            if (err) {
                console.log('Error while performing query ' + err.message);
                return done(err);
            }

            if (!rows.length) {
                console.log('No user found');
                return done(null, false, req.flash('loginMessage', 'Geen gebruiker gevonden.'));
            }
            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password)) {
                console.log('Incorrect password');
                return done(null, false, req.flash('loginMessage', 'Oeps! Verkeerde wachtwoord.'));
            }

            // all is well, return successful user
            console.log('User logged in with id ' + rows[0].id);
            return done(null, rows[0]);
        });
    }))
};