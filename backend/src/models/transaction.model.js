const { Document, Schema } = require("mongoose");
const mongoose = require("mongoose");

const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, default: "Pending" },
    providerId: { type: String },
    type: {
      type: String,
      enum: ["Deposit", "Withdrawal"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
