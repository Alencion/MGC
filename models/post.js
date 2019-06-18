module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        gamename: {
            type: DataTypes.STRING(140),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);
