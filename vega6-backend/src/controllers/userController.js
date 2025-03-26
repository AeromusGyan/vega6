const userService = require('../services/userService');
const fs = require('fs');

class UserController {
    async createUser(req, res) {
        try {
            const {email, password, name} = req.body;
            if (!email || !password || !name) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({errors: "All fields are required"});
            }

            const newUser = await userService.createUser(req.body, req.file);
            res.status(201).json(newUser);
        } catch (error) {
            console.log(error)
            fs.unlinkSync(req.file.path);
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({status: 404, message: error.message});
        }
    }

    async createRole(req, res) {
        try {
            const newRole = await userService.createRole(req.body);
            res.status(201).json(newRole);
        } catch (error) {
            console.log(error)
            res.status(400).json({status: 400, message: error.message});
        }
    }

    async getRoles(req, res) {
        try {
            const roles = await userService.getRoles();
            res.status(200).json({data: roles, total: roles.length});
        } catch (error) {
            res.status(500).json({status: 500, message: error.message});
        }
    }
}

module.exports = new UserController();
