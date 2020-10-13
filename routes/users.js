var express = require('express');
var router = express.Router();
const axios = require("axios");

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const User = models.user;

/**
 * 유저 로그인
 * 현재 이메일만 받아서 로그인 되는 형태
 * 현재 이메일 및 아이디 값도 전달하지만, 실제에선 액세스 토큰만 보낼 예정
 * 해당 엑세스 토큰을 API 마다 검증하여 나온 결과값 (아이디, 이메일)로 API호출 예정
 */
router.get("/login", async (req, res, next) => {
    try {
        const { email } = req.query;

        const user_result = await User.findOne({
            where : {
                email
            }
        });

        if(!user_result || !user_result.dataValues) {
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

// 테스트용 유저 생성 API
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
