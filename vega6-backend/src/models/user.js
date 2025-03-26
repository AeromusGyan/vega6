module.exports = (sequelize, DataTypes, Model) => {
    class User extends Model {
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Images',
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
    });
    return User;
}
