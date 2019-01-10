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

db.User.hasMany(db.Article, {foreignKey : 'user_index',sourceKey:'user_index'});
db.Article.belonsTo(db.User,{foreignKey : 'user_index', targetKey:'id'});


module.exports = db;