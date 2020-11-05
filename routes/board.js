var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const User = models.user;
const Board = models.board;

// 최근 게시글 순으로 가져오기
router.get("/all", async (req, res, next) => {
    try {
        const result = await Board.findAll({
            include: [
                { model: User, attributes: ["id", "name", "image", "address"] }, 
            ],
            order : [["createdAt", "DESC"]]
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

// 게시글 생성하기
router.post("/create", Token.accessVerify, async (req, res, next) => {
    const { title, content, image, category, price, negotiation, state } = req.body;
    const { token, id } = req.user;
    try {

        const result = await Board.create({
            title,
            content,
            image,
            category,
            price,
            negotiation,
            state,
            success: false,
            userId: id
        });

        const Boardid = result.getDataValue("id");

        const board = await Board.findOne({
            include: [
                { model: User, attributes: ["id", "name", "image", "address"] }, 
            ],
            where : {
                id: Boardid
            }
        });

        res.send({
            data : board,
            token
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
