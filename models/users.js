module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id : {
            type: DataTypes.INTEGER,     // 구분용
            primaryKey : true,
            autoIncrement: true
        },
        email : {
            type: DataTypes.STRING,      // 소셜 로그인 이메일
            allowNull: false
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
    });
    User.associate = function(models) {

    }
    return User;
};