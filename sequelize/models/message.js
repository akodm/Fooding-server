const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('message', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        content : {
            type: DataTypes.STRING,      // 내용
            allowNull: false
        },
        category : {
            type: DataTypes.STRING,      // 텍스트인지 이미지인지 등의 여부
        },
        image : {
            type: DataTypes.STRING,      // 이미지 첨부의 경우 이미지 주소
        }
    });
};