// db에서 article table을 불러옵니다.

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('article', {
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        view: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: false,
        },
        created_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        userId:{
            type : DataTypes.INTEGER,
            allowNull:false,
        },
        boardname:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
    },{
        timestmamps:false,
    });
};