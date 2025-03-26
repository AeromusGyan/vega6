const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRepo = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET || 'Vega';

class AuthController {
    async generateToken(req, res) {
        const {email, password} = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({
                    status: 400,
                    message: 'Username / email and password are required.'
                });
            }
            let user;

            if (email.includes('@')) {
                user = await userRepo.getByEmail(email);
            } else {
                return res.status(404).json({status: 404, message: 'Invalid username or password'});
            }
            if (user.status === false) {
                return res.status(403).json({status: 403, message: 'User is inactive'});
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(403).json({status: 403, message: 'Invalid username or password'});
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                JWT_SECRET, // Secret key
                {expiresIn: '7d'}
            );

            res.status(200).json({
                status: 200,
                message: 'Authentication successful',
                token,
                user: user
            });

        } catch (error) {
            console.error('Error generating token:', error);
            res.status(500).json({status: 500, message: 'Internal server error'});
        }
    }
}

module.exports = new AuthController();
