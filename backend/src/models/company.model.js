const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  value: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

const CompanySchema = new mongoose.Schema(
  {
    name: FieldSchema,
    linkedInUrl: FieldSchema,
    address: FieldSchema,
    website: FieldSchema,
    phone: FieldSchema,
    employees: FieldSchema,
    retailLocation: FieldSchema,
    industry: FieldSchema,
    keywords: FieldSchema,
    facebook: FieldSchema,
    twitter: FieldSchema,
    city: FieldSchema,
    state: FieldSchema,
    country: FieldSchema,
    seoDescription: FieldSchema,
    technologies: FieldSchema,
    annualRevenue: FieldSchema,
    totalFunding: FieldSchema,
    latestFunding: FieldSchema,
    latestFundingAmount: FieldSchema,
    lastRaisedAt: FieldSchema,
    // Add other company fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
