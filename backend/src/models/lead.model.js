const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  linkedInUrl: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyId: { type: String, required: true },
  contactId: { type: String, required: true },
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
});

module.exports = mongoose.model('Company', CompanySchema);
