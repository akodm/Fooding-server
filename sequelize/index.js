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
	require('./models/items'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

/**
 *  Sequelize Associate Options Line ------------------------------------
 *  (ex)
 *  const { user, item } = sequelize.models;
 *  user.hasOne(item);
 *  ---------------------------------------------------------------------
 */

 if(DB_FORCE === "true") {
    sequelize.sync({ force : DB_FORCE });
 } else {
    sequelize.sync();
 }

module.exports = sequelize;