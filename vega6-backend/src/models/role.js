module.exports = (sequelize, DataTypes, Model) => {
    class Role extends Model {
    }

    Role.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        }, roleName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize, modelName: 'Role', timestamps: false
    });
    return Role;
}
