var path = require('path');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var db = {};

var sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Article = require('./article')(sequelize, Sequelize);

db.User.hasMany(db.Article, {foreignKey : 'userId',sourceKey:'id'});
db.Article.belongsTo(db.User, {foreignKey : 'userId', targetKey:'id'});

//db.User.hasMany(db.Article);
//db.Article.belongsTo(db.User);

module.exports = db;