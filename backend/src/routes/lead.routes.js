const express = require("express");
const router = express.Router();
const leadController = require("../controllers/lead.controller");
const auth = require("../middleware/auth");

// Create a new lead
router.post("/", leadController.create);
router.post("/export", auth, leadController.bulkExportLeads);
router.post("/export-bulk", auth, leadController.fetchRandomLeads);

// Retrieve all companies
router.get("/", leadController.findAll);

router.get("/dashboard", leadController.getDashboardData);

router.get("/search", leadController.searchLeads);

// Retrieve a single lead
router.get("/:id", leadController.findOne);

// Update a lead
router.put("/:id", leadController.update);

// Retrieve all companies
router.get("/linkedin/:id", leadController.getLinkedin);

// Delete a lead
router.delete("/:id", leadController.delete);

module.exports = router;
