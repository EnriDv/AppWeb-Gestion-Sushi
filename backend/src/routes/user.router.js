const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { 
    getMyProfile,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser 
} = require('../controllers/user.controller');

router.use(protect);

router.get('/me', getMyProfile);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
