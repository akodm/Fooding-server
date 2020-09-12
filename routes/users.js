var express = require('express');
var router = express.Router();
const cors = require("cors");

const models = require("../models");

const User = models.user;

router.get('/all', cors(), async function(req, res, next) {
    try {
        const result = await User.findAll();

        res.send(result);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
