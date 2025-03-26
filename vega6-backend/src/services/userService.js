const bcrypt = require('bcrypt');
const {db} = require('../models');
const imageService = require("./imageService");

class UserService {
    async createUser(userData, file) {
        const existingUserByEmail = await this.getByEmail(userData.email);
        if (existingUserByEmail) {
            throw new Error('Email is already registered.');
        }
        try {
            const image = await imageService.createImage(file);
            const {password} = userData;
            const hashed = await bcrypt.hash(password, 10);
            userData.password = hashed;
            userData.status = true;
            userData.roleId = 2;
            userData.profile_id = image.id

            const newUser = await db.User.create(userData);
            newUser.Role = await db.UserRoles.create({RoleId: userData.roleId, UserId: newUser.id});
            return newUser;
        } catch (error) {
            throw new Error(error ? error.message : 'User creation failed.');
        }
    }

    async getUserById(id) {
        const user = await this.getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createRole(roleData) {
        const existingRole = await db.Role.findOne({where: {roleName: roleData.roleName}});
        if (existingRole) {
            throw new Error('Role already exists');
        }
        try {
            return await db.Role.create(roleData);
        } catch (error) {
            console.log(error);
            throw new Error(error.parent.message);
        }
    }

    async getRoles() {
        try {
            return await db.Role.findAll({order: [["id", "DESC"]]});
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getByEmail(email) {
        return await db.User.findOne({
            where: {email}, include: [{
                model: db.UserRoles, as: "userRoles", attributes: ["RoleId"],
                include: [{
                    model: db.Role, attributes: ["roleName"]
                }]
            }, {
                model: db.Image, as: 'profile'
            }]
        });
    }

    async getById(userId) {
        return await db.User.findByPk(userId);
    }
}

module.exports = new UserService();
