module.exports = (sequelize, DataTypes, Model) => {
    class Image extends Model {
    }

    Image.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        file_name: DataTypes.STRING,
        mime_type: DataTypes.STRING,
        disk: DataTypes.STRING,
        size: DataTypes.INTEGER,
        original_url: {
            type: DataTypes.STRING,
            get() {
                const rawUrl = this.getDataValue('original_url');
                const prefix =`http://${process.env.URL}/`;
                return rawUrl ? prefix + rawUrl : null;
            }
        }
    }, {
        sequelize,
        modelName: 'Image',
        timestamps: true
    });

    return Image;
};
