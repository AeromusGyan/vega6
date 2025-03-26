const express = require('express');

const userController = require('../controllers/userController');
const blogController = require("../controllers/blogController");

const upload = require('../middlewares/upload');
const {verifyToken, checkRole} = require('../middlewares/auth');

const {userValidation} = require('../utils/validator');

const {check} = require("express-validator");
const path = require("path");

class Routes {
    constructor() {
    }

    authRoutes(router) {
        const authController = require('../controllers/authController');
        router.post('/token', authController.generateToken);
    }

    roleRoutes(router) {
        router.get('/roles/', verifyToken, userController.getRoles);
        router.post('/roles/', verifyToken, userController.createRole);
    }

    userRoutes(router) {
        router.get('/users/:id', verifyToken, userController.getUserById);
        router.post('/users/', upload.single('profile'), userController.createUser);
    }

    blogRoutes(router) {
        router.post('/blogs/', verifyToken, upload.single('image'), blogController.create);
        router.get('/blogs/', verifyToken, blogController.getAll);
        router.get('/blogs/:id', verifyToken, blogController.getBlogById);
        router.get('/blogs/slug/:slug', verifyToken, blogController.getBlogBySlug);
        router.put('/blogs/:id', verifyToken, upload.single('image'), blogController.updateBlog);
        router.delete('/blogs/:id', verifyToken, blogController.deleteBlog);
        router.post('/blogs/replies', verifyToken, blogController.replyBlog);
    }

    initializeRoutes(app) {
        const router = express.Router();
        app.use('/uploads', express.static(path.join(__dirname, '../..', 'uploads')));
        this.authRoutes(router);
        this.roleRoutes(router);
        this.userRoutes(router);
        this.blogRoutes(router);

        app.use('/api', router);
    }
}

module.exports = new Routes();