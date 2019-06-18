// db에서 category table을 불러옵니다.

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category', {
        category: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
    },{
        timestamps:false,
    });
}
//insert into categories values(1,'대학게시판');