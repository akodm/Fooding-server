var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const Message = models.message;

router.get("/room/all", async (req, res, next) => {
    const { roomId } = req.query;

    try {
        const result = await Message.findAll({
            where : {
                roomId
            }
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

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
