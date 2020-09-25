const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        email : {
            type: DataTypes.STRING,      // 소셜 로그인 이메일
            allowNull: false,
			unique: true,
        },
        name : {
            type: DataTypes.STRING,      // 설정 닉네임
            allowNull: false
        },
        phone : {
            type: DataTypes.STRING,      // 설정 전화번호
        },
        address : {
            type: DataTypes.STRING,      // 설정 주소지
        },
        access : {
            type: DataTypes.STRING,      // 엑세스 토큰
        },
        refresh : {
            type: DataTypes.STRING,      // 리프레시 토큰
        },
    });
};