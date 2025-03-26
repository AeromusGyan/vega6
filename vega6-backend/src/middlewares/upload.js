const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.path, file, cb)
        let filepath = req.path || '';
        filepath = filepath.replace(/\\/g, '/');
        const folder = filepath || '';
        const uploadPath = path.join(__dirname, '../..', 'uploads', folder);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }

        cb(null, `uploads/${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
};

// Multer Configuration
const upload = multer({
    storage: storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: fileFilter
});

module.exports = upload;