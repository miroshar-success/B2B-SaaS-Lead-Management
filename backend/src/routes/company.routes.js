const express = require('express');
const router = express.Router();
const companyController = require('./controllers/company.controller');

// Create a new company
router.post('/', companyController.create);

// Retrieve all companies
router.get('/', companyController.findAll);

// Retrieve a single company
router.get('/:id', companyController.findOne);

// Update a company
router.put('/:id', companyController.update);

// Delete a company
router.delete('/:id', companyController.delete);

module.exports = router;
