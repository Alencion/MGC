module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        client_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        client_pw: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        e_mail: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    },{
        timestamps:false,
       // tableName:'user',
    });
}