var path = require('path');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var db = {};

var sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize; // 내 db에 연결한 Sequelize 객체접근명
db.Sequelize = Sequelize; // Sequelize 객체 접근명

//내 db에 연결한 Sequelize와 그냥 Sequelize 객체에 model 연결후 db에 객체접근명
db.User = require('./user')(sequelize, Sequelize);
db.Article = require('./article')(sequelize, Sequelize);

//테이블 끼리 포린키 연결
db.User.hasMany(db.Article, {foreignKey : 'userId',sourceKey:'id'});
db.Article.belongsTo(db.User, {foreignKey : 'userId', targetKey:'id'});
// 포린키에 언더바 _ 가 있을경우 오류가난다.
//db.User.hasMany(db.Article);
//db.Article.belongsTo(db.User);

module.exports = db;