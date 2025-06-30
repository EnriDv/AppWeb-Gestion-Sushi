const { User } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    if (!user || !user.id) {
        throw new Error('Invalid user data for token generation');
    }
    
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number
    };
    
    console.log('Generating token with payload:', payload);
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
        issuer: 'sushi-app',
        audience: 'sushi-app-client'
    });
};

const register = async (req, res) => {
    const { name, phone_number, email, password, address } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            phone_number,
            email,
            password,
            address,
        });

        if (user) {
            const token = generateToken(user);

            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user);
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
};
