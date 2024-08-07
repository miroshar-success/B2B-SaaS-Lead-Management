const Transaction = require("../models/transaction.model");

// Get transactions for a specific user
exports.getUserTransactions = async (req, res) => {
  const userId = req.user?.id; // Assuming user ID is available in the request object

  try {
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

// Get all transactions (admin only)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};
