const { Sequelize } = require('sequelize');

console.log("mysql database connecting..");

const { DB, ROOT, PASS, HOST, DB_FORCE } = process.env;

let sequelize = null;
try {
    sequelize = new Sequelize( DB, ROOT, PASS, {
        host : HOST,
        dialect: 'mysql',
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        }
    });
    
    const modelDefiners = [
        require('./models/users'),
        require('./models/board'),
        require('./models/room'),
        require('./models/message'),
    ];
    
    for (const modelDefiner of modelDefiners) {
        modelDefiner(sequelize);
    }
    
    const { board, room, message, user } = sequelize.models;
    
    // user <-> board
    user.hasMany(board);
    board.belongsTo(user);
    
    // user <-> room
    room.belongsToMany(user, { as: "userId", through: "chatRoom" });
    user.belongsToMany(room, { as: "roomId", through: "chatRoom" });
    
    // room <-> board
    room.belongsTo(board);
    board.hasMany(room);
    
    // message <-> user / room
    message.belongsTo(user);
    message.belongsTo(room);
    user.hasMany(message);
    room.hasMany(message);
    
     if(DB_FORCE === "true") {
        sequelize.sync({ force : DB_FORCE });
     } else {
        sequelize.sync();
     }

    console.log("mysql database connect success !");
} catch(err) {
    console.log("mysql database connect error :", err);
    process.exit(1);
}

module.exports = sequelize;