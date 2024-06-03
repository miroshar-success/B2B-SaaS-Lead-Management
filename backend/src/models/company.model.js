const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkedInUrl: { type: String, required: true },
  companyId: { type: String, required: true },
  address: String,
  website: String,
  phone: String,
  employees: Number,
  industry: String,
  // Add other company fields as needed
});

module.exports = mongoose.model('Company', CompanySchema);
