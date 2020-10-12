var express = require('express');
var router = express.Router();
const axios = require("axios");

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const User = models.user;

const { CLIENT_ID, CLIENT_SID, SERVER_URL } = process.env;

router.get("/naver/login", async (req, res, next) => {
    try {
        const ran = Math.random().toString(36).substr(2,11);
        res.send({
            url : `https://nid.naver.com/oauth2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${SERVER_URL}/users/naver/callback&state=${ran}`,
            state : ran
        });
    } catch(err) {
        next(err);
    }
});

router.get("/naver/callback", async (req, res, next) => {
    try {
        const code = req.query.code;
        const state = req.query.state;

        const result = await axios.get(`https://nid.naver.com/oauth2.0/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SID}&grant_type=authorization_code&state=${state}&code=${code}`);

        const data = result.data;

        if(!data) { throw "user unauthorization"; }

        const user = await axios.get(`https://openapi.naver.com/v1/nid/me`, {
            headers : {
                "Authorization" : data.token_type + " " + data.access_token
            }
        })

        const user_data = user.data;

        if(user_data.message !== "success") { throw "user unauthorization"; }

        const profile = user_data.response;

        if(!profile.email || !profile.name) { throw "login failed"; }

        res.send(true);
    } catch(err) {
        next(err);
    }
});

router.get("/login", async (req, res, next) => {
    try {
        const { email } = req.query;

        const user_result = await User.findOne({
            where : {
                email
            }
        });

        if(!user_result && !user_result.dataValues) {
            throw {
                status : 500
            };
        }

        req.query.id = user_result.dataValues.id;

        const result = await Token.refresh(req, next);

        if(!result) {
            throw {
                status : 500
            };
        }

        res.send({
            data : true,
            token : result,
            user : {
                email : email,
                id : user_result.dataValues.id
            }
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

router.post("/create", async (req, res, next) => {
    try {
        const result = await User.create({
            email : req.body.email
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
