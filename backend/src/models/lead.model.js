const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  linkedInUrl: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyId: { type: String, required: true },
  contactId: { type: String, required: true },
  email: String,
  firstPhone: String,
  title: String,
  jobTitle: String,
  seniority: String,
  departments: String,
  workPhone: Number,
  homePhone: Number,
  mobilePhone: String,
  otherPhone: String,
  city: String,
  state: String,
  country: String,
  facebook: String,
  twitter: String,
  pastCompanies: String,
  // Add other company fields as needed
},
{ timestamps: true }
);

module.exports = mongoose.model('lead', LeadSchema);
