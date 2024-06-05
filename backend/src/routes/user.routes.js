const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create a new user
router.post('/register', userController.create);

// User login
router.post('/login', userController.login);

// User logout
router.post('/logout', userController.logout);

// Retrieve all users (admin or super_admin only)
router.get('/', userController.authenticate, userController.authorize('admin', 'super_admin'), userController.findAll);

// Retrieve a single user by ID (admin or super_admin only)
router.get('/:id', userController.authenticate, userController.authorize('admin', 'super_admin'), userController.findOne);

// Update a user by ID (admin or super_admin only)
router.put('/:id', userController.authenticate, userController.authorize('admin', 'super_admin'), userController.update);

// Update user role (admin or super_admin only)
router.put('/:id/role', userController.authenticate, userController.authorize('admin', 'super_admin'), userController.updateRole);

// Delete a user by ID (admin or super_admin only)
router.delete('/:id', userController.authenticate, userController.authorize('admin', 'super_admin'), userController.delete);

module.exports = router;
