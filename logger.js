var config = require('./config');
var router = require('express').Router();

module.exports = router;

router.use(delimiter);
router.use(logger);

function logger(req, res, next) {
    console.log('[LOG] %s %s %s', new Date(), req.method, req.url);
    next();
}

function delimiter(req, res, next) {
    console.log(config.delimiter);
    next();
}

