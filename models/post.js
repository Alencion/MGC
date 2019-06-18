// (미완성) nodejs에서 post Table을 조회하는 model.

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
