const {db} = require('../models');
const imageService = require("../services/imageService")
const fs = require("fs");
const {where} = require("sequelize");

class BlogController {

    async create(req, res) {
        try {
            const data = {...req.body};
            const {title, slug, description, status} = data;
            if (!title || !slug || !description || !status || !req.file) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({errors: 'All fields are required'});
            }
            const blog = await db.Blog.findOne({
                where: {slug: data.slug}
            });
            if (blog) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({errors: 'Blog already exists'});
            }
            const image = await imageService.createImage(req.file);
            data.thumbnail_id = image.id;
            data.user_id = req.user.id;
            data.slug = slug.toLowerCase().replace(/ /g, '-');

            const newBlog = await db.Blog.create(data);

            res.status(201).json(newBlog);
        } catch (error) {
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async getAll(req, res) {
        try {
            const blogs = await db.Blog.findAll({
                where: {user_id: req.user.id},
                include: [{model: db.Image, as: 'thumbnail'}]
            });
            res.status(200).json(blogs);
        } catch (error) {
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async getBlogById(req, res) {
        try {
            const blog = await db.Blog.findOne({
                where: {id: req.params.id},
                include: [
                    {
                        model: db.Reply,
                        as: 'replies'
                    }
                ]
            });
            if (!blog) {
                return res.status(404).json({status: 404, message: 'Blog is not found!'});
            }
            res.status(200).json(blog);
        } catch (error) {
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async getBlogBySlug(req, res) {
        try {
            const blog = await db.Blog.findOne({
                where: {slug: req.params.slug},
                include: [
                    {model: db.Image, as: 'thumbnail'}, {
                    model: db.Reply,
                    as: 'replies'
                }],

            });
            if (!blog) {
                return res.status(404).json({status: 404, message: 'Blog is not found!'});
            }
            res.status(200).json(blog);
        } catch (error) {
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async updateBlog(req, res) {
        try {
            const data = {...req.body};
            const {title, slug, description, status} = data;
            if (!title || !slug || !description || !status || !req.file) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({errors: 'All fields are required'});
            }
            const blog = await db.Blog.findByPk(req.params.id);
            if (!blog) {
                throw new Error('Blog not found');
            }
            const newVar = await blog.update(req.body);
            await imageService.updateImage(req.body.thumbnail_id, req.file);

            res.status(200).json(newVar);
        } catch (error) {
            console.log(error)
            fs.unlinkSync(req.file.path);
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async deleteBlog(req, res) {
        try {
            const blog = await db.Blog.findByPk(req.params.id);
            if (!blog) {
                throw new Error('Blog not found');
            }
            await blog.destroy();
            res.status(200).json({status: 200, message: 'Blog deleted successfully'});
        } catch (error) {
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async replyBlog(req, res) {
        try {
            const {text, comment_id, blogId} = req.body;
            const blog = await db.Blog.findByPk(blogId);
            if (!blog) {
                throw new Error('Blog not found');
            }
            const data = {
                text,
                user_id: req.user.id,
                blogId: blog.id
            }
            if (comment_id) {
                const reply = await db.Reply.findByPk(comment_id);
                if (!reply) {
                    throw new Error('Reply not found');
                }
                data.comment_id = reply.id;
            }
            const created = await db.Reply.create(data);
            res.status(200).json(created);
        } catch (error) {
            res.status(400).json({status: 400, message: error.message});
        }
    }
}

module.exports = new BlogController();