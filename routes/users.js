var express = require('express');
var router = express.Router();

const models = require("../models");

const User = models.user;

router.get('/all', async function(req, res, next) {
    try {
        const result = await User.findAll();

        res.send(result);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
