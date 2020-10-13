const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('board', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        title : {
            type: DataTypes.STRING,      // 제목
            allowNull: false
        },
        content : {
            type: DataTypes.STRING,      // 내용
            allowNull: false
        },
        image : {
            type: DataTypes.JSON,        // 이미지
        },
        category : {
            type: DataTypes.STRING,      // 카테고리
            allowNull: false
        },
        price : {
            type: DataTypes.STRING,      // 가격
        },
        negotiation : {
            type: DataTypes.STRING,      // 협의 여부
        },
        state : {
            type: DataTypes.STRING,      // 판매 혹은 요청 여부
        },
        success : {
            type: DataTypes.STRING,      // 거래 완료 상태
        },
    });
};