module.exports = (sequelize, DataTypes, Model) => {
    class Reply extends Model {
    }

    Reply.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        comment_id: DataTypes.INTEGER,
        blogId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Blogs',
                key: 'id',
            }
        },
    }, {
        sequelize,
        modelName: 'Reply',
        timestamps: false
    })
    return Reply;
}