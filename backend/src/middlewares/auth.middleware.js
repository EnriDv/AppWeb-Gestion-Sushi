const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
    console.log('=== Authentication Middleware Triggered ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    let token;

    // Verificar si el token está en la cabecera 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // Obtener el token de la cabecera (formato: 'Bearer TOKEN')
        token = req.headers.authorization.split(' ')[1];
        console.log('Token found in Authorization header');
    } else {
        console.error('No token provided in request');
        return res.status(401).json({
            success: false,
            error: 'Not authorized',
            details: 'No authentication token provided. Please log in.'
        });
    }

    if (!token) {
        console.error('Token is empty');
        return res.status(401).json({
            success: false,
            error: 'Not authorized',
            details: 'Authentication token is empty'
        });
    }

    try {
        console.log('Verifying JWT token...');
        console.log('JWT Secret:', process.env.JWT_SECRET ? 'Present' : 'MISSING!');
        
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully. Decoded:', JSON.stringify(decoded, null, 2));

        if (!decoded || !decoded.id) {
            console.error('Invalid token payload:', decoded);
            return res.status(401).json({
                success: false,
                error: 'Not authorized',
                details: 'Invalid token payload'
            });
        }

        // Buscar al usuario en la base de datos
        console.log(`Looking for user with ID: ${decoded.id}`);
        const user = await User.findByPk(decoded.id, {
            attributes: { 
                exclude: ['password'],
                include: ['id', 'name', 'email', 'phone_number']
            }
        });

        if (!user) {
            console.error(`User with ID ${decoded.id} not found in database`);
            return res.status(404).json({
                success: false,
                error: 'User not found',
                details: 'The user associated with this token no longer exists'
            });
        }

        console.log('User found:', {
            id: user.id,
            email: user.email,
            name: user.name
        });

        // Adjuntar el usuario a la petición
        req.user = user.get({ plain: true });
        
        // Continuar al siguiente middleware/controlador
        next();
        
    } catch (error) {
        console.error('=== AUTHENTICATION ERROR ===');
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            expiredAt: error.expiredAt,
            timestamp: new Date().toISOString()
        });

        // Manejar diferentes tipos de errores de JWT
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
                details: 'The authentication token is invalid'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired',
                details: 'Your session has expired. Please log in again.'
            });
        }

        // Para otros errores inesperados
        console.error('Unexpected authentication error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed',
            details: 'An error occurred during authentication',
            systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = { protect };
