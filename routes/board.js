var express = require('express');
var router = express.Router();

const token_require = require("../tokenModule");
const Token = new token_require();

const { models } = require("../sequelize");

const User = models.user;
const Board = models.board;

router.get("/all", async (req, res, next) => {
    try {
        const result = await Board.findAll({
            include: [
                { model: User, attributes: ["name", "address"] }, 
            ]
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

router.post("/create", async (req, res, next) => {
    const { title, content, image, category, price, negotiation, state } = req.body;
    
    // id ..
    // const { } = req.user;

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
            userId : req.body.userId
        });

        res.send({
            data : result
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;
