const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

// Create a new lead
router.post('/', leadController.create);

// Retrieve all companies
router.get('/', leadController.findAll);

// Retrieve a single lead
router.get('/:id', leadController.findOne);

// Update a lead
router.put('/:id', leadController.update);

// Delete a lead
router.delete('/:id', leadController.delete);

module.exports = router;
