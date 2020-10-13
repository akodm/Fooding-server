var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const Message = models.message;

// 해당 채팅룸의 모든 메시지 가져오기
router.get("/room/all", async (req, res, next) => {
    const { roomId } = req.query;

    try {
        const result = await Message.findAll({
            where : {
                roomId
            },
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

// 메시지 생성하기 -> 보낸 이 아이디 및 채팅룸 아이디 필요
router.post("/create", async (req, res, next) => {
    const { content, category, image, send_id, roomId } = req.body;

    try {
        const result = await Message.create({
            content,
            category,
            image,
            send_id,
            roomId
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
