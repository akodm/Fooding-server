const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('room', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        user1 : {
            type: DataTypes.INTEGER,      // 룸의 유저 아이디 1
            allowNull: false
        },
        user2 : {
            type: DataTypes.INTEGER,      // 룸의 유저 아이디 2
            allowNull: false
        },
    });
};