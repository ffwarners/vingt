var router = require('express').Router();
var url = require('url');

var dbHandler = require('./databaseHandler');
var config = require('./config');

// connect to mysql
var connection;

module.exports = function (app, passport, Connection) {
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

    router.get('/login', getLogin);
    router.post('/login', passport.authenticate('local-login', config.loginOptions), postLogin);

    router.get('/logout', logout);

    router.get('/', home);
    router.get('/kaart', kaart);
    router.get('/contact-us.html', contact);
    router.get('/index.html', home);
    router.get('/portfolio.html', portfolio);
    router.get('/services.html', service);

    router.get('/start', isLoggedIn, showStart);
    router.get('/adaptKaart', isLoggedIn, adaptKaart);
    router.get('/editWine?', isLoggedIn, editWineRoute);
    router.get('/editWineColumn?', isLoggedIn, editWineColumnRoute);
    router.get('/addNewColumnWine?', isLoggedIn, addNewColumn);
    router.get('/deleteWineColumn?', isLoggedIn, deleteWineColumn);
    router.get('/newWine?', isLoggedIn, newWineRoute);
    router.get('/deleteWine?', isLoggedIn, deleteWineRoute);
    app.use(router);
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('loginMessage', 'You have to be logged in');
        res.redirect('/login');
    }
}

function getLogin(req, res) {
    res.render('login', {message: req.flash('loginMessage')});
}
function postLogin(req, res) {
    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
}
function logout(req, res) {
    req.logout();
    res.redirect('/login');
}

function home(req, res) {
    res.sendFile(__dirname + '/views/home.html');
}

function kaart(req, res) {
    dbHandler.getWineColumns(function (columns) {
        dbHandler.getWines(function (rows) {
            res.render('kaart', {wines: rows, columns: columns});
        });
    });
}
function adaptKaart(req, res) {
    dbHandler.getWineColumns(function (columns) {
        dbHandler.getWines(function (rows) {
            res.render('adoptKaart', {wines: rows, columns: columns});
        });
    });
}

function editWineRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {

        var update = "UPDATE wines SET `" + query.changed + "` = '" + query.newvalue + "' where wine_id=" + query.id;

        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update wines');
            } else {
                console.log("wines successfully updated");
                connection.query("SELECT * FROM wines WHERE id =?;", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function editWineColumnRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.old !== undefined) {
        var type = "TEXT";
        if (query.old === parseInt(query.old, 10)) {
            type = "INT";
        }
        var update = "ALTER TABLE wines CHANGE `" + query.old + "` `" + query.newvalue + "` " + type;
        console.log(update);
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update columns');
            } else {
                console.log("wines successfully updated");
                connection.query("SELECT * FROM wines", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no old defined");
    }
}

function addNewColumn(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.name !== undefined) {
        var update = "ALTER TABLE wines ADD `" + query.name + "` TEXT";
        console.log(update);
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update columns');
            } else {
                console.log("wines successfully updated");
                connection.query("SELECT * FROM wines", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no new name defined");
    }
}

function deleteWineColumn(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.delete !== undefined) {
        var update = "ALTER TABLE wines DROP COLUMN `" + query.delete + "`";
        console.log(update);
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to delete columns');
            } else {
                console.log("column succesfully deleted");
                connection.query("SELECT * FROM wines", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no deletion defined");
    }
}

function newWineRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    var update = "INSERT INTO wines () VALUES()";
    connection.query(update, function (err, rows) {
        if (err) {
            console.error('Error while performing query: ' + err.message);
            res.end('Failed to add new wine');
        } else {
            console.log(rows.insertId);
            console.log("new wine successfully added");
            res.json(rows.insertId);
        }
    });
}

function deleteWineRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {
        var update = "DELETE FROM wines WHERE wine_id = " + query.id;
        console.log(update);
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to delete wine');
            } else {
                console.log("wine successfully deleted");
                connection.query("SELECT * FROM wines", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
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

function showStart(req, res) {
    dbHandler.getUser(req.user.id, function (rows) {
        res.render('ingelogd', {user: rows[0].name})
    });
}