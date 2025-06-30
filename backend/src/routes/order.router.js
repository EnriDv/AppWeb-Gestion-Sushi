const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { 
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/order.controller');

router.use(protect);

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

router.patch('/:id/status', updateOrderStatus);

router.delete('/:id', deleteOrder);

module.exports = router;
