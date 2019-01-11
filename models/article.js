module.exports = (sequelize, DataTypes) => {
    return sequelize.define('article', {
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        description: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
        },
        view: {
            type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
            allowNull: false,
        },

        created_date: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('now()'),
        },
        user_id:{
            type : DataTypes.INTEGER,
            allowNull:false,
        },
    },{
        timestmamps:false,
       // tableName:'article',
    });
};