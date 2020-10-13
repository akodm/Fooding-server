var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const models = require("../sequelize");

const Board = models.models.board;
const Room = models.models.room;
const User = models.models.user;
const ChatRoom = models.models.chatRoom;

const Op = models.Sequelize.Op;

/**
 * 해당 유저가 속해있는 채팅방 찾기
 * -> 채팅 룸
 *  -> 게시판 정보
 *  -> 유저 정보 1
 *  -> 유저 정보 2
 */
router.get("/user/all", async (req, res, next) => {
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

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

/**
 * 채팅 방 생성하기
 * -> 유저 1, 유저2, 게시판 아이디 참조
 *  -> 채팅방 내역에 유저 추가 ( 유저1, 채팅룸 아이디 / 유저2, 채팅룸 아이디 )
 */
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
                data : overlap.dataValues,
                ovl : true
            });
            return false;
        }

        const result = await Room.create({
            boardId,
            user1,
            user2
        });

        if(!result) throw 500;
        
        const roomId = result.getDataValue("id");

        if(!roomId) throw 500;

        await ChatRoom.bulkCreate([
            {
                roomId, userId : user1
            }, {
                roomId, userId : user2
            }
        ]);

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
        })

        res.send({
            data,
            ovl : false
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
