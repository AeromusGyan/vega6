const {db} = require('../models');

class ImageService {

    async createImage(file) {
        try {
            if (!file) {
                throw new Error('Image data is required');
            }
            const normalizedPath = file.path.replace(/\\/g, '/');
            const image = {
                name: file.originalname,
                file_name: file.filename,
                mime_type: file.mimetype,
                disk: file.destination,
                size: file.size,
                original_url: normalizedPath
            };
            const createdImage = await db.Image.create(image);
            return createdImage;
        } catch (error) {
            throw error;
        }
    }

    async updateImage(id, file) {
        try {
            const image = await db.Image.findByPk(id);
            if (!image) {
                throw new Error('Image not found');
            }
            const updatedImage = await image.update({
                name: file.originalname,
                file_name: file.filename,
                mime_type: file.mimetype,
                disk: file.destination,
                size: file.size,
                original_url: file.path
            });
            return updatedImage;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ImageService();