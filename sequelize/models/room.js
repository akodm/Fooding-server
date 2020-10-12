const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('room', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        target_id : {
            type: DataTypes.STRING,      // 수신 유저 아이디
            allowNull: false
        },
        send_id : {
            type: DataTypes.STRING,      // 송신 유저 아이디
            allowNull: false
        },
    });
};