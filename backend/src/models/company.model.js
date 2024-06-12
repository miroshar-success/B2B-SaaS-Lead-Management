const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkedInUrl: { type: String, required: true },
  // companyId: { type: String, required: true },
  address: String,
  website: String,
  phone: String,
  employees: Number,
  retailLocation: Number,
  industry: String,
  keywords: String,
  facebook: String,
  twitter: String,
  city: String,
  state: String,
  country: String,
  seoDescription: String,
  technologies: String,
  annualRevenue: Number,
  totalFunding: Number,
  latestFunding: Number,
  latestFundingAmount: Number,
  lastRaisedAt: Number,
  // Add other company fields as needed
},
{ timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
