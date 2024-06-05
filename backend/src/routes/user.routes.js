const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create a new user
router.post('/', userController.create);

// Retrieve all cusers
router.get('/', userController.findAll);

// Retrieve a single user
router.get('/:id', userController.findOne);

// Update a user
router.put('/:id', userController.update);

// Delete a user
router.delete('/:id', userController.delete);

module.exports = router;
