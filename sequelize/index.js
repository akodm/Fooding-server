const { Sequelize } = require('sequelize');

const { DB, ROOT, PASS, HOST, DB_FORCE } = process.env;

const sequelize = new Sequelize( DB, ROOT, PASS, {
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

user.hasMany(board);
board.belongsTo(user);

room.belongsToMany(user, { as: "userId", through: "chatRoom" });
user.belongsToMany(room, { as: "roomId", through: "chatRoom" });

room.belongsTo(board);
board.hasMany(room);

message.belongsTo(room);
room.hasMany(message);

 if(DB_FORCE === "true") {
    sequelize.sync({ force : DB_FORCE });
 } else {
    sequelize.sync();
 }

module.exports = sequelize;