const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  // Add other company fields as needed
},
{ timestamps: true });

module.exports = mongoose.model('user', UserSchema);
