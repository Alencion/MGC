module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category', {
        category: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        categoryid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },{
        timestamps:false,
    });
}