const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: {
      type: { type: String, default: "Free" },
      time: { type: String, default: "Monthly" },
    },
    emailCredit: { type: Number, default: 0 },
    phoneCredit: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
