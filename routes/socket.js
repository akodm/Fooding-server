let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.send("socket test");
});

router.get("/test/ping", function(req, res, next) {
    try {
        res.send("pong");
    } catch(err) {
        next(err);
    }
});

module.exports = router;
