module.exports = (sequelize, DataTypes, Model) => {
    class UserRole extends Model {
    }

    UserRole.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
        sequelize,
        modelName: 'UserRole',
        timestamps: false
    })
    return UserRole;
}