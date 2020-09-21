var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("express test!");
});

router.get("/test/ping", function(req, res, next) {
    try {
        res.send("pong");
    } catch(err) {
        next(err);
    }
});

module.exports = router;
