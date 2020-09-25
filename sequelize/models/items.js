const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('item', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        name : {
            type: DataTypes.STRING,      // 설정 닉네임
            allowNull: false
        }
    });
};