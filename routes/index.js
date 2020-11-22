let express = require('express');
let router = express.Router();

const redis = require("redis");
const redisClient = require("../redis");

router.get('/', function(req, res, next) {
    setTimeout(() => {
        res.send("express test!");
    }, 5000);
});

router.get("/test/ping", function(req, res, next) {
    try {
        res.send("pong");
    } catch(err) {
        next(err);
    }
});

// redis example
router.post("/test/redis/set", async function(req, res, next) {
    try {
        const { key, value } = req.body;

        await redisClient.setAsync(key, value, 'EX', 60 * 60 * 24).then(result => console.log(result));

        res.send(true);
    } catch(err) {
        next(err);
    }
});

router.get("/test/redis/get", async function(req, res, next) {
    try {
        const { key } = req.query;

        redisClient.getAsync(key)
        .then(value => {
            res.send(value);
        })
        .catch(err => {
            next(err);
        });
    } catch(err) {
        next(err);
    }
});

router.post("/test/redis/set/json", async function(req, res, next) {
    try {
        const { key, value } = req.body;

        await redisClient.setAsync(key, JSON.stringify(value), 'EX', 60 * 60 * 24).then(result => console.log(result));

        res.send(true);
    } catch(err) {
        next(err);
    }
});

router.get("/test/redis/get/json", async function(req, res, next) {
    try {
        const { key } = req.query;

        redisClient.getAsync(key)
        .then(value => {
            res.send(JSON.parse(value));
        })
        .catch(err => {
            next(err);
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
