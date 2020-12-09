let express = require('express');
let router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const Message = models.message;
const User = models.user;

// 해당 채팅룸의 모든 메시지 가져오기
router.get("/room/all", Token.accessVerify, async (req, res, next) => {
    const { roomId } = req.query;
    const { token } = req.user;

    try {
        const result = await Message.findAll({
            include: [
                { model: User, attributes: ["id", "name", "image", "address"] }, 
            ],
            where : {
                roomId
            },
        });

        res.send({
            data : result,
            token
        });
    } catch(err) {
        next(err);
    }
});

// 메시지 생성하기 -> 보낸 이 아이디 및 채팅룸 아이디 필요
router.post("/create", Token.accessVerify, async (req, res, next) => {
    const { content, category, image, roomId } = req.body;
    const { token, id } = req.user;

    try {
        const result = await Message.create({
            content,
            category,
            image,
            userId : id,
            roomId
        });

        res.send({
            data : result,
            token
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
