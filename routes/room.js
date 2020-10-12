var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const models = require("../sequelize");

const Board = models.models.board;
const Room = models.models.room;
const User = models.models.user;

const Op = models.Sequelize.Op;

router.get("/user/all", async (req, res, next) => {
    const { userId } = req.query;

    try {
        const result = await Room.findAll({
            include: [{ 
                model: Board, include: [{
                model: User, attributes: ["id", "name", "address"]
            }] }],
            where : {
                [Op.or] : [
                    { target_id : userId },
                    { send_id : userId }
                ]
            }
        });

        res.send({
            data : result
        })
    } catch(err) {
        next(err);
    }
});

router.post("/create", async (req, res, next) => {
    const { target_id, send_id, boardId } = req.body;

    try {
        const overlap = await Room.findOne({
            include: [{ model: Board, include: [{ model: User, attributes: ["id", "name", "address"] }]}],
            where : {
                target_id : target_id,
                send_id : send_id,
                boardId : boardId
            }
        });

        if(overlap && overlap.dataValues) {
            res.send({
                data : overlap.dataValues,
                ovl : true
            });

            return true;
        }

        await Room.create({
            target_id : target_id,
            send_id : send_id,
            boardId : boardId
        });

        const room = await Room.findOne({
            include: [{ model: Board, include: [{ model: User, attributes: ["id", "name", "address"] }]}],
            where : {
                target_id : target_id,
                send_id : send_id,
                boardId : boardId
            }
        });

        res.send({
            data : room,
            ovl : false
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
