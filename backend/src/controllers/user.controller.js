const { User } = require('../models');

const getMyProfile = async (req, res) => {
    try {
        console.log('=== getMyProfile called ===');
        
        if (!req.user || !req.user.id) {
            console.error('No user ID in request');
            return res.status(401).json({ 
                success: false,
                error: 'Not authenticated',
                details: 'No user ID found in request'
            });
        }

        console.log('Looking for user with ID:', req.user.id);
        
        try {
            await User.sequelize.authenticate();
            console.log('Database connection has been established successfully.');
        } catch (dbError) {
            console.error('Unable to connect to the database:', dbError);
            return res.status(500).json({
                success: false,
                error: 'Database connection error',
                details: dbError.message
            });
        }

        // Buscar al usuario
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'phone_number', 'address']
        });

        console.log('User from database:', user ? 'Found' : 'Not found');

        if (!user) {
            console.error(`User with ID ${req.user.id} not found in database`);
            return res.status(404).json({ 
                success: false,
                error: 'User not found',
                details: `No user found with ID: ${req.user.id}`
            });
        }
        
        res.json({
            success: true,
            data: user
        });
        
    } catch (err) {
        console.error('=== ERROR in getMyProfile ===');
        console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? {
                message: err.message
            } : undefined
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        console.error(`Error fetching all Users:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `User not found` });
        }
    } catch (err) {
        console.error(`Error fetching User by ID:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    if (req.body.password) {
        delete req.body.password;
    }

    try {
        const [updatedRowsCount] = await User.update(req.body, {
            where: { id: req.params.id },
        });
        if (updatedRowsCount > 0) {
            const updatedUser = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            });
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: `User not found or no changes made` });
        }
    } catch (err) {
        console.error(`Error updating User:`, err);
        res.status(400).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedRowsCount = await User.destroy({
            where: { id: req.params.id },
        });
        if (deletedRowsCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: `User not found` });
        }
    } catch (err) {
        console.error(`Error deleting User:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getMyProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
