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