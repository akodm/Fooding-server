let express = require('express');
let router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const models = require("../sequelize");
const sequelize = require('../sequelize');

const Board = models.models.board;
const Room = models.models.room;
const User = models.models.user;
const ChatRoom = models.models.chatRoom;

const Op = models.Sequelize.Op;

router.get("/user/all/include/message", async (req, res, next) => {
    const { userId } = req.query;
    try {
        const result = await Room.findAll({
            where : {
                [Op.or] : [
                    { user1 : userId },
                    { user2 : userId },
                ]
            },
            include: [{ 
                model: User, 
                as: "userId",
                required: true,
                attributes: ["id", "name", "address", "image"],
            }, {
                model: Board
            }],
        });

        // room latest message
        const messageGet = result.map(data => {
            return data.getMessages({
                limit: 1,
                order: [["id", "DESC"]]
            });
        });
        const parserResult = await Promise.all(messageGet);

        const newResult = result.map((data, index) => {
            return {
                room: data,
                message: parserResult[index][0]
            }
        });

        res.send(newResult);
    } catch(err) {
        console.log(err);
    }
});

// Token.accessVerify
router.post("/create", async (req, res, next) => {
    const { boardId, user1, user2 } = req.body;

    if(user1 === user2) {
        res.send({
            data : false
        });
        return false;
    }

    try {
        const overlap = await Room.findOne({
            include: [{ 
                model: User, 
                as: "userId",
                required: true,
                attributes: ["id", "name", "address", "image"],
            }, {
                model: Board
            }],
            where : {
                boardId,
                user1,
                user2
            }
        });

        if(overlap && overlap.dataValues) {
            res.send({
                data : overlap,
                ovl : true
            });
            return false;
        }

        const resultData = await sequelize.transaction(async (t) => {
            const room = await Room.create({
                boardId,
                user1,
                user2
            }, { transaction: t });
    
            const roomId = room.getDataValue("id");
    
            if(!roomId) throw 500;
    
            await ChatRoom.bulkCreate([
                { roomId, userId : user1 }, 
                { roomId, userId : user2 }
            ], { transaction: t });
    
            const data = await Room.findOne({
                include: [{ 
                    model: User, 
                    as: "userId",
                    required: true,
                    attributes: ["id", "name", "address", "image"],
                }, {
                    model: Board
                }],
                where : {
                    boardId,
                    user1,
                    user2
                }
            });

            return data;
        });

        res.send({
            data: resultData,
            ovl : false
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
