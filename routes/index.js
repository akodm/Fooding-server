var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const config = process.env.NODE_ENV === "development" ? require("../config") : require("../config");


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
