var router = require('express').Router();
var url = require('url');
var sh = require("shorthash");
var fs = require('fs');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var path = require('path');
var getDirName = require('path').dirname;

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var dbHandler = require('./databaseHandler');
var config = require('./config');

// connect to mysql
var connection;

var auth = {
    auth: {
        api_key: 'key-eadd5996875559e35a0948edc0478cb8',
        domain: 'sandboxaa40e321565e4288abd236f2e92a6cbd.mailgun.org'
    }
};

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

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
    router.get('/contact', contact);
    router.get('/impressie', impressie);
    router.get('/blog?', blog);

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

    router.get('/registration?', registration);
    router.post('/registrate', sendmail);
    router.get('/confirmed?', confirm);

    router.get('/aanmelders', isLoggedIn, aanmelders);
    router.get('/removeAanmelder?', isLoggedIn, removeAanmelder);
    router.get('/editAanmelders?', isLoggedIn, editAanmeldersRoute);
    router.get('/sign-out', signOut);
    router.get('/signout?', sendSignoutMail);
    router.get('/confirmSignOut?', confirmSignOut);

    router.post('/contact', contactPost);
    router.get('/wijn?', wijnen);

    router.post('/upload', isLoggedIn, upload);
    router.post('/crop', isLoggedIn, crop);
    router.get('/crop?', isLoggedIn, crop2);
    router.get('/crops', isLoggedIn, cropShow);
    router.get('/lastId', isLoggedIn, lastId);
    router.get('/test', test);

    router.get('/email?', isLoggedIn, emailPage);
    router.post('/email', isLoggedIn, email);

    router.get('/reactie?', reactieRender);
    router.post('/reactie', reactie);

    router.get('/adaptBlog', adaptBlog);
    router.get('/deleteBlog?', deleteBlogRoute);
    router.get('/changeApproved?', changeApprovedRoute);
    app.use(router);
};

function test(req, res) {
    dbHandler.getAanmeldersProeverij(15, function (rijen) {
        res.render('proeverijEmailSend', {
            onderwerp: 'test',
            aanmelder: rijen[0],
            bericht: "testBericht",
            link: "/reactie?" + encrypt("id=15")
        })
    });
}

function reactieRender(req, res) {
    var string = req.url.substring(9);
    var dc = decrypt(string);
    dc = "/reactie?" + dc;
    var query = url.parse(dc, true).query;
    console.log(query);
    dbHandler.getProeverij(query.id, function (rijen) {
        var update = "SELECT * FROM aanmelders WHERE id = " + query.aanmelderId;
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to select aanmelders');
            } else {
                res.render('reactie', {proeverij: rijen[0], message: "", failure: "", aanmelder: rows[0]});
            }
        });
    });
}

function reactie(req, res) {
    console.log(req.body);
    dbHandler.getProeverij(req.body.proeverijId, function (rows) {
        var query = "SELECT * FROM aanmelders WHERE id = " + req.body.aanmelderId;
        connection.query(query, function (err, rijen) {
            var date = new Date();
            var update = "INSERT INTO blog VALUES(0, '" + req.body.name + "', '" + rows[0].name + "', '" + req.body.message + "', '" + rows[0].date + "', '" + date.toDateString() + "', '" + req.body.rate+ "', '" + "false" + "');";
            connection.query(update, function (err, rowss) {
                if (err) {
                    console.error('Error while performing query: ' + err.message);
                    res.render('reactie', {proeverij: rows[0], message: "", failure: "Uw bericht is niet verstuurd, probeer het later nog eens..", aanmelder: rijen[0]});
                } else {
                    res.render('reactie', {proeverij: rows[0],message: "Uw bericht is succesvol verstuurd, bedankt voor uw reactie.", failure: "", aanmelder: rijen[0]});
                }
            });
        });
    });
}

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
    dbHandler.getWines(function (rows) {
        rows.forEach(function (rijen) {
            rijen.link = encrypt("id=" + rijen.wine_id);
        });
        res.render('kaart', {wines: rows});
    });
}

function cropShow(req, res) {
    dbHandler.getWines(function (rows) {
        res.render('crops', {wines: rows});
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
                console.log("Wines successfully updated");
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
                console.log("Proeverijen successfully updated");
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
                console.log("Wines successfully updated");
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
                console.log("Wines successfully updated");
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
                console.log("Column succesfully deleted");
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
            console.log("New wine successfully added");
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
                console.log("Wine successfully deleted");
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
                console.log("Proeverij successfully deleted");
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
                console.log("Proeverijen successfully updated");
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
            console.log("New proeverij successfully added");
            res.json(rows.insertId);
        }
    });
}

function aanmelders(req, res) {
    dbHandler.getProeverijen(function (rijen) {
        dbHandler.getAanmelders(function (rows) {
            res.render('aanmelders', {aanmelders: rows, proeverijen: rijen});
        });
    });
}

function contact(req, res) {
    res.render('contact', {message: "", failure: ""});
}

function impressie(req, res) {
    res.sendFile(__dirname + '/views/impressie.html');
}

function blog(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;
    var page = query.page;
    if(!query.page) page = 1;
    dbHandler.getBlog(function (rows) {
        if(Math.ceil((rows.length-1)/2) >= page && page>0) {
            rows.forEach(function (row) {
                row.link = encrypt("?id=" + row.id);
            });
            console.log(rows);
            res.render('blog', {blog: rows, pagina: page});
        } else {
            res.render('404');
        }
    });
}

function adaptBlog(req, res) {
    dbHandler.getBlogRaw(function(rows) {
        res.render('adaptBlog', {blog: rows});
    });
}

function deleteBlogRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {
        var update = "DELETE FROM blog WHERE id = " + query.id;
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to delete blog');
            } else {
                console.log("Blog successfully deleted");
                connection.query("SELECT * FROM wines", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function changeApprovedRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {

        var update = "UPDATE blog SET approved='" + query.approved + "' where id=" + query.id;

        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update blog');
            } else {
                console.log("Blog successfully updated");
                connection.query("SELECT * FROM blog WHERE id =?;", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function proeverijen(req, res) {
    dbHandler.getProeverijen(function (rows) {
        rows.forEach(function (row) {
            row.id = sh.unique("id=" + row.id);
        });
        res.render('proeverijen', {proeverijen: rows});
    });
}

function showStart(req, res) {
    dbHandler.getUser(req.user.id, function (rows) {
        dbHandler.getLastChange(function (rijen) {
            res.render('ingelogd', {user: rows[0].name, time: rijen[0].UPDATE_TIME})
        });

    });
}

function crop2(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;
    var id = query.id;
    dbHandler.getWijn(id, function (rows) {
        res.render('crop', {
                wine: rows[0], close: ""
            }
        );
    });
}

function sendmail(req, res) {
    var id = req.body.id;
    dbHandler.getProeverij(id, function (row) {
        var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/email.ejs', 'utf8'));
        var string = "name=" + req.body.name + "&email=" + req.body.email + "&telephone=" + req.body.telephone + "&gender=" + req.body.gender + "&birthdate=" + req.body.birthdate + "&language=" + req.body.language + "&proeverijId=" + row[0].id + "&proeverijName=" + row[0].name;

        var html = compiled({proeverij: row[0], person: req.body, link: encrypt(string)});

        nodemailerMailgun.sendMail({
            // from: "Vingt wijnhandelaar, <vingt@gmail.com>",
            // to: '"' + req.body.name + '" <' + req.body.email + ">, Steven Lambregts <stevenlambregts@gmail.com>",
            from: "Steven Lambregts <stevenlambregts@gmail.com>",
            to: "Steven Lambregts <stevenlambregts@gmail.com>",
            subject: 'Vingt - [Bevestig] bevestig uw registratie voor ' + req.body.proeverij,
            html: html
        }, function (err, info) {
            if (err) {
                console.error(err);
            }
            else {
                res.redirect('/');
            }
        });
    });
}

function emailPage(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;
    var id = query.id;
    if (id !== "All") {
        dbHandler.getProeverij(id, function (row) {
            dbHandler.getAanmeldersProeverij(id, function (rijen) {
                res.render('proeverijEmail', {
                    message: "",
                    failure: "",
                    proeverij: row[0],
                    aanmelders: rijen
                });
            });
        });
    } else {
        dbHandler.getAanmelders(function (rows) {
            res.render('proeverijEmail', {
                message: "",
                failure: "",
                proeverij: {id: 'All', name: "All", datum: '-', details: '-'},
                aanmelders: rows
            });
        });
    }
}

function email(req, res) {
    console.log(req.body);
    if (req.body.id !== "All") {
        dbHandler.getProeverij(req.body.id, function (rijen) {
            dbHandler.getAanmeldersProeverij(req.body.id, function (rows) {
                rows.forEach(function (row) {
                    var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/proeverijEmailSend.ejs', 'utf8'));
                    var link = "";
                    if (req.body.onderwerp === "Other") req.body.onderwerp = req.body.other;
                    if (req.body.onderwerp === "Validatie") link = "reactie?" + encrypt("id=" + req.body.id + "&aanmelderId=" + row.id);
                    var html = compiled({
                        onderwerp: req.body.onderwerp,
                        aanmelder: row,
                        bericht: req.body.message,
                        link: link
                    });

                    nodemailerMailgun.sendMail({
                        // from: "Vingt wijnhandelaar, <vingt@gmail.com>",
                        // to: '"' + row.name + '" <' + row.email + ">",
                        from: "Steven Lambregts <stevenlambregts@gmail.com>, ",
                        to: "Steven Lambregts <stevenlambregts@gmail.com>",
                        subject: 'Vingt - [' + req.body.onderwerp + ']',
                        html: html
                    }, function (err, info) {
                        if (err) {
                            console.error(err);
                            res.render('proeverijEmail', {
                                message: "",
                                failure: "Uw bericht is niet verstuurd, probeer het later nog eens..",
                                proeverij: rijen[0],
                                aanmelders: rows
                            });
                        }
                        else {
                        }
                    });
                });
                res.render('proeverijEmail', {
                    message: "Uw bericht is succesvol verstuurd",
                    failure: "",
                    proeverij: rijen[0],
                    aanmelders: rows
                });
            });
        });
    } else {
        dbHandler.getAanmelders(function (rows) {
            rows.forEach(function (row) {
                var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/proeverijEmailSend.ejs', 'utf8'));
                var link = "";
                if (req.body.onderwerp === "Other") req.body.onderwerp = req.body.other;
                if (req.body.onderwerp === "Validatie") link = "reactie?" + encrypt("id=" + req.body.id);
                var html = compiled({
                    onderwerp: req.body.onderwerp,
                    aanmelder: row,
                    bericht: req.body.message,
                    link: link
                });

                nodemailerMailgun.sendMail({
                    // from: "Vingt wijnhandelaar, <vingt@gmail.com>",
                    // to: '"' + row.name + '" <' + row.email + ">",
                    from: "Steven Lambregts <stevenlambregts@gmail.com>, ",
                    to: "Steven Lambregts <stevenlambregts@gmail.com>",
                    subject: 'Vingt - [' + req.body.onderwerp + ']',
                    html: html
                }, function (err, info) {
                    if (err) {
                        console.error(err);
                        res.render('proeverijEmail', {
                            message: "",
                            failure: "Uw bericht is niet verstuurd, probeer het later nog eens..",
                            proeverij: rijen[0],
                            aanmelders: rows
                        });
                    }
                    else {
                    }
                });
            });
            res.render('proeverijEmail', {
                message: "Uw bericht is succesvol verstuurd",
                failure: "",
                proeverij: {id: 'All', name: "All", datum: '-', details: '-'},
                aanmelders: rows
            });
        });
    }
}

function confirm(req, res) {
    var string = req.url.substring(11);
    var dc = decrypt(string);
    dc = "/confirmed?" + dc;
    var query = url.parse(dc, true).query;
    var string2 = "SELECT * FROM aanmelders WHERE name = ? AND email = ? AND proeverijName = ? AND proeverijId = ?";
    var values = [query.name, query.email, query.proeverijName, query.proeverijId];
    connection.query(string2, values, function (err, rijen) {
        if (rijen.length === 0) {
            var update = "INSERT INTO aanmelders () VALUES (0, '" + query.name + "', '" + query.email + "', '" + query.gender + "', '" + query.birthdate + "', '" + query.telephone + "', '" + query.language + "', '" + query.proeverijName + "', " + query.proeverijId + ")";
            connection.query(update, function (err, rows) {
                if (err) {
                    console.error('Error while performing query: ' + err.message);
                    res.end('Failed to add new aanmelder');
                } else {
                    console.log("New aanmelder successfully added");
                    res.render('confirm', {person: query});
                }
            });
        } else {
            res.render('declined', {person: query})
        }
    });
}

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function removeAanmelder(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {
        var update = "DELETE FROM aanmelders WHERE id = " + query.id;
        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to delete aanmelder');
            } else {
                console.log("Aanmelder successfully deleted");
                connection.query("SELECT * FROM aanmelders", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function editAanmeldersRoute(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;

    if (query.id !== undefined) {

        var update = "UPDATE aanmelders SET `" + query.changed + "` = '" + query.newvalue + "' where id=" + query.id;

        connection.query(update, function (err, rows) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to update aanmelders');
            } else {
                console.log("Aanmelders successfully updated");
                connection.query("SELECT * FROM aanmelders WHERE id =?;", [query.id], function (err, result) {
                    res.json(result);
                });
            }
        });
    } else {
        res.end("Error: no id defined");
    }
}

function signOut(req, res) {
    dbHandler.getProeverijen(function (rows) {
        res.render('signout', {proeverijen: rows});
    });
}

function sendSignoutMail(req, res) {
    var urlData = url.parse(req.url, true);
    var query = urlData.query;
    var rijen;
    if (query.email !== undefined) {
        connection.query("SELECT * FROM aanmelders WHERE email ='" + query.email + "' AND proeverijID = " + query.id, function (err2, rows) {
            rijen = rows;
            rows.forEach(function (aanmelder) {
                var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/uitschrijven.ejs', 'utf8'));
                var link = "id=" + aanmelder.id + "&proeverijID=" + aanmelder.proeverijID;
                link = encrypt(link);
                var html = compiled({aanmelder: aanmelder, link: link});

                nodemailerMailgun.sendMail({
                    // from: "Vingt wijnhandelaar, <vingt@gmail.com>, " req.body.name + "<" + req.body.email + ">",
                    // to: '"' + req.body.name + '" <' + req.body.email + ">, Steven Lambregts <stevenlambregts@gmail.com>",
                    from: "Steven Lambregts <stevenlambregts@gmail.com>",
                    to: aanmelder.name + "<" + aanmelder.email + ">",
                    subject: 'Vingt - [Uitschrijven] ' + aanmelder.proeverijName,
                    html: html
                }, function (err, info) {
                    if (err) {
                        res.end('Error: ' + err);
                    }
                });
            });
            res.json(rijen);
        });
    }
}

function confirmSignOut(req, res) {
    var string = req.url.substring(16);
    var dc = decrypt(string);
    dc = "/confirmSignOut?" + dc;
    var query = url.parse(dc, true).query;
    if (query.id !== undefined) {
        var update = "DELETE FROM aanmelders WHERE id = '" + query.id + "' AND proeverijID = " + query.proeverijID;
        connection.query(update, function (err, result) {
            if (err) {
                console.error('Error while performing query: ' + err.message);
                res.end('Failed to delete aanmelder');
            } else {
                console.log("Aanmelder successfully deleted");
                res.render('confirmUitschrijving');
            }
        });
    } else {
        res.end("Error: no email defined");
    }
}

function contactPost(req, res) {
    var compiled = ejs.compile(fs.readFileSync(__dirname + '/views/contactMail.ejs', 'utf8'));

    var html = compiled({person: req.body});

    nodemailerMailgun.sendMail({
        // from: "Vingt wijnhandelaar, <vingt@gmail.com>, " req.body.name + "<" + req.body.email + ">",
        // to: '"' + req.body.name + '" <' + req.body.email + ">, Steven Lambregts <stevenlambregts@gmail.com>",
        from: req.body.name + "<" + req.body.email + ">",
        to: "Steven Lambregts <stevenlambregts@gmail.com>, " + req.body.name + "<" + req.body.email + ">",
        subject: 'Vingt - [Kopie van uw mail] ' + req.body.subject,
        html: html
    }, function (err, info) {
        if (err) {
            console.error(err);
            res.render('contact', {
                message: "",
                failure: "Uw bericht is niet verstuurd, probeer het later nog eens.."
            })
        }
        else {
            res.render('contact', {message: 'Uw bericht is succesvol verstuurd', failure: ""})
        }
    });
}

function wijnen(req, res) {
    var urlData = url.parse(req.url, true);
    var string = req.url.substring(6);
    var dc = decrypt(string);
    dc = "/wine?" + dc;
    var query = url.parse(dc, true).query;
    dbHandler.getWineColumns(function (rows) {
        dbHandler.getWijn(query.id, function (rijen) {
            res.render('wijn', {wine: rijen[0], columns: rows});
        });
    });
}

function upload(req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to disallow the user to upload multiple files in a single request
    form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/client/images/wines');
    var name = "";
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        dbHandler.getMaxId(function (rows) {
            var ext = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            name = "wine" + rows[0]['MAX(wine_id)'] + "." + ext;
            fs.rename(file.path, path.join(form.uploadDir, name));

            var urlData = url.parse(req.url, true);
            var query = urlData.query;
            var update = "UPDATE wines SET imageExt = '" + ext + "' WHERE wine_id = " + rows[0]['MAX(wine_id)'];
            connection.query(update, function (err, rows) {
                if (err) {
                    console.error('Error while performing query: ' + err.message);
                    res.end('Failed to update wines');
                } else {
                    console.log("Wines successfully updated");
                    connection.query("SELECT * FROM wines", function (err, result) {
                        // res.json(result);
                    });
                }
            });
        });
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // parse the incoming request containing the form data
    form.parse(req);

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

}

function crop(req, res) {
    var imageBuffer = decodeBase64Image(req.body.imagebase64);
    var id = req.body.id;
    var name = "";
    name = "wine" + id;
    fs.writeFile('client/images/wines/small/' + name + '.jpg', imageBuffer.data, function (err) {
    });
    res.redirect('adaptKaart');
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function lastId(req, res) {
    dbHandler.getMaxId(function (rows) {
        res.json(rows[0]['MAX(wine_id)']);
    });
}
