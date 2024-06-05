const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create a new user
router.post('/', userController.create);

// User login
router.post('/login', userController.login);

// User logout
router.post('/logout', userController.logout);

// Retrieve all users
router.get('/', userController.authenticate, userController.findAll);

// Retrieve a single user by ID
router.get('/:id', userController.authenticate, userController.findOne);

// Update a user by ID
router.put('/:id', userController.authenticate, userController.update);

// Delete a user by ID
router.delete('/:id', userController.authenticate, userController.delete);

module.exports = router;
