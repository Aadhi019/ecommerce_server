const express = require('express');
const { createOrder, getOrders, getOrder, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;