module.exports = (sequelize, DataTypes, Model) => {
    class Blog extends Model {
    }

    Blog.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: DataTypes.STRING,
        thumbnail_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Images',
                key: 'id',
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
    }, {
        sequelize,
        modelName: 'Blog',
        timestamps: true
    });

    return Blog;
};
