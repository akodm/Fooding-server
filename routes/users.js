var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const User = models.user;

router.get("/login/sign", async (req, res, next) => {
    try {
        const { id, email } = req.query;

        const user_result = await User.findOne({
            where : {
                id,
                email
            }
        });

        if(!user_result && !user_result.dataValues) {
            throw {
                status : 500
            };
        }

        const result = await Token.refresh(req, next);

        if(!result) {
            throw {
                status : 500
            };
        }

        res.send({
            data : true,
            token : result
        });
    } catch(err) {
        next(err);
    }
});

router.get("/login/access", Token.accessVerify, async (req, res, next) => {
    try {
        res.send({
            data : true,
            user : req.user,
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
