var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const User = models.user;

router.get("/login/init", async (req, res, next) => {
    try {
        const { email } = req.query;
        const userResult = await User.findOne({
            where : {
                email,
            }
        });

        if(!userResult || !userResult.dataValues) throw { status : 500 };

        req.query.id = userResult.dataValues.id;
        const token = await Token.refresh(req, next);

        if(!token) throw { status : 500 };

        res.send({
            data : true,
            token,
            user : {
                id : userResult.dataValues.id,
                email : userResult.dataValues.email
            }
        });
    } catch(err) {
        next(err);
    }
});

router.get("/login/storage", Token.accessVerify,  async (req, res, next) => {
    try {
        const { token, id, email } = req.user;

        res.send({
            data : true,
            token,
            user: {
                id,
                email
            }
        });
    } catch(err) {
        next(err);
    }
});

router.post("/create", async (req, res, next) => {
    const { email } = req.body;
    try {
        const result = await User.create({
            email,
        });

        console.log("User Craete :", result.dataValues);
        res.send(result);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
