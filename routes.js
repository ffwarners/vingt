var router = require('express').Router();
var url = require('url');
var sh = require("shorthash");
var fs = require('fs');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');


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
    router.get('/proeverijen', proeverijen);
    router.get('/contact-us.html', contact);
    router.get('/index.html', home);
    router.get('/portfolio.html', portfolio);

    router.get('/start', isLoggedIn, showStart);
    router.get('/adaptKaart', isLoggedIn, adaptKaart);
    router.get('/adaptProeverijen', isLoggedIn, adaptProeverijen);

    router.get('/editWine?', isLoggedIn, editWineRoute);
    router.get('/editWineColumn?', isLoggedIn, editWineColumnRoute);
    router.get('/addNewColumnWine?', isLoggedIn, addNewColumn);
    router.get('/deleteWineColumn?', isLoggedIn, deleteWineColumn);
    router.get('/newWine?', isLoggedIn, newWineRoute);
    router.get('/deleteWine?', isLoggedIn, deleteWineRoute);

    router.get('/changeHidden?', isLoggedIn, changeHiddenRoute);
    router.get('/editProeverij?', isLoggedIn, editProeverijRoute);
    router.get('/deleteProeverij?', isLoggedIn, deleteProeverijRoute);
    router.get('/newProeverij?', isLoggedIn, addNewProeverij);

    router.get('/registrationUn?', registrationUn);
    router.get('/registration?', registration);
    router.post('/registrate', sendmail);
    router.get('/test', test);
    router.get('/confirmUn?', confirmedUn);
    router.get('/confirmed?', confirm);
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
            res.render('adaptKaart', {wines: rows, columns: columns});
        });
    });
}

function adaptProeverijen(req, res) {
    dbHandler.getProeverijen(function (rows) {
        res.render('adaptProeverijen', {proeverijen: rows});
    });
}

function registrationUn(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;
    console.log(query.id);
    console.log("hashed: " + sh.unique("id=" + query.id));


    res.redirect('registration?' + sh.unique("id=" + query.id));
}

function registration(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    var url2 = req.url;
    var id = url2.substring(14);
    var hashedId;
    var correctId;
    dbHandler.getProeverijenID(function (rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            hashedId = sh.unique("id=" + row.id);
            if (hashedId === id) {
                correctId = row.id;
                break;
            }
        }
        if (!correctId) res.render('404');
        dbHandler.getProeverij(correctId, function (rows) {
            if (rows[0].shown === "true") {
                res.render('registration', {proeverij: rows[0]});
            } else {
                res.render('404');
            }
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
                connection.query("SELECT * FROM wines WHERE wine_id =?;", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function editProeverijRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {

        var update = "UPDATE proeverijen SET `" + query.changed + "` = '" + query.newvalue + "' where id=" + query.id;

        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update proeverijen');
            } else {
                console.log("proeverijen successfully updated");
                connection.query("SELECT * FROM proeverijen WHERE id =?;", [query.id], function (err, result) {
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

function deleteProeverijRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {
        var update = "DELETE FROM proeverijen WHERE id = " + query.id;
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to delete proeverij');
            } else {
                console.log("proeverijen successfully deleted");
                connection.query("SELECT * FROM proeverij", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function changeHiddenRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {

        var update = "UPDATE proeverijen SET shown=" + query.shown + " where id=" + query.id;

        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update proeverijen');
            } else {
                console.log("proeverijen successfully updated");
                connection.query("SELECT * FROM proeverijen WHERE id =?;", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function addNewProeverij(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    var update = "INSERT INTO proeverijen VALUES(0, '" + query.name + "', '" + query.date + "', '" + query.details + "', 'true');";
    connection.query(update, function (err, rows) {
        if (err) {
            console.error('Error while performing query: ' + err.message);
            res.end('Failed to add new proeverij');
        } else {
            console.log("new proeverij successfully added");
            res.json(rows.insertId);
        }
    });
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

function proeverijen(req, res) {
    dbHandler.getProeverijen(function (rows) {
        res.render('proeverijen', {proeverijen: rows});
    });
}

function showStart(req, res) {
    dbHandler.getUser(req.user.id, function (rows) {
        res.render('ingelogd', {user: rows[0].name})
    });
}

function test(req, res) {
    dbHandler.getProeverij(1, function (rows) {
        res.render('email', {
                proeverij: rows[0], person: {
                    id: '2',
                    proeverij: 'Hidden proeverij',
                    gender: 'man',
                    name: 'Steven Lambregts',
                    email: 'stevenlambregts@gmail.com',
                    telephone: '06-123456789',
                    birthdate: '1998-10-22',
                    language: 'dutch'
                }
            }
        );
    });
}

function sendmail(req, res) {
    var id = req.body.id;
    dbHandler.getProeverij(id, function (row) {
        var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/email.ejs', 'utf8'));
        var html = compiled({proeverij: row[0], person: req.body});

        var auth = {
            auth: {
                api_key: 'key-eadd5996875559e35a0948edc0478cb8',
                domain: 'sandboxaa40e321565e4288abd236f2e92a6cbd.mailgun.org'
            }
        };

        var nodemailerMailgun = nodemailer.createTransport(mg(auth));

        nodemailerMailgun.sendMail({
            from: "Vingt wijnhandelaar, <vingt@gmail.com>",
            to: '"' + req.body.name + '" <' + req.body.email + ">, Steven Lambregts <stevenlambregts@gmail.com>",
            subject: 'Vingt - bevestig uw registratie voor ' + req.body.proeverij,
            html: html
        }, function (err, info) {
            if (err) {
                console.error('Error: ' + err);
            }
            else {
                res.redirect('/');
            }
        });
    });
}

function confirmedUn(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;
    var string = JSON.stringify(query);
    res.redirect('confirmed?' + encrypt(string));
}

function confirm(req, res) {
    var urlData = url.parse(req.url, true);
    var string = req.url.substring(11);
    var dc = decrypt(string);
    var query = JSON.parse(dc);
    console.log(query);

    //TODO::
    var update = "INSERT INTO aanmelders () VALUES (0, '" + query.name + "', '" + query.email + "', '" + query.gender + "', '" + query.birthdate + "', '" + query.telephone + "', '" + query.language + "', '" + query.proeverijName + "', " + query.proeverijId + ")";
    connection.query(update, function (err, rows) {
        if (err) {
            console.error('Error while performing query: ' + err.message);
            res.end('Failed to add new aanmelder');
        } else {
            console.log("new aanmelder successfully added");
            res.render('confirm', {person: query});
        }
    });

}

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}
