var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

router.get('/', function(req, res, next) {
    res.send("express test!");
    return;
});

router.get("/test/ping", function(req, res, next) {
    try {
        res.send("pong");
    } catch(err) {
        next(err);
    }
});

module.exports = router;
