let express = require('express');
let router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const models = require("../sequelize");
const sequelize = require('../sequelize');
const redis = require('../redis');

const Board = models.models.board;
const User = models.models.user;
const Op = models.Sequelize.Op;

/**
 * 필터 api 방식에서 사용할 내용.
 * redis를 이용한 캐싱.
 * Mysql 자체의 필터링.
 * 쿼리문이 너무 길어지거나 시간이 오래 걸릴 시, 서버 코드에서 필터링.
 * redis에서 필터링 된 내용을 캐싱하여 저장. -> 다음번에 호출 시 캐싱 데이터 전달.
 * redis의 데이터를 mysql / 서버 필터링 된 내용과 비교하여 내용이 다르다면 새롭게 캐싱.
 */
router.get('/', function(req, res, next) {
    res.send("filter test");
});

module.exports = router;