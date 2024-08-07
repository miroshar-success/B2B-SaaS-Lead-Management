const express = require("express");
const {
  getUserTransactions,
  getAllTransactions,
} = require("../controllers/transaction.controller");
const auth = require("../middleware/auth");

const router = express.Router();

// Route to get transactions for the logged-in user
router.get("/", auth, getUserTransactions);

// Route to get all transactions (admin only)
router.get("/all", auth, getAllTransactions);

module.exports = router;
