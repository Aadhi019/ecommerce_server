const express = require('express');
const { getDashboardStats, getAllUsers, updateUserStatus, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;