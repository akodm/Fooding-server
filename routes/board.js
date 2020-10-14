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
            order : ["createdAt"]
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

// 게시글 생성하기
router.post("/create", async (req, res, next) => {
    const { title, content, image, category, price, negotiation, state, userId } = req.body;
    
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
            userId
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
