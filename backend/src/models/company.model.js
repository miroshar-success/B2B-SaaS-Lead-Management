const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  value: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

const LevelSchema = new mongoose.Schema({
  value: {
    type: String,
    enum: [
      "1-10",
      "11-20",
      "21-50",
      "51-100",
      "101-200",
      "201-500",
      "501-1000",
      "1001-2000",
      "2001-5000",
      "5001-10000",
      "100001+",
    ],
  },
  lastUpdated: { type: Date, default: Date.now },
});

const ArraySchema = new mongoose.Schema({
  value: { type: [String] },
  lastUpdated: { type: Date, default: Date.now },
});

const CompanySchema = new mongoose.Schema(
  {
    linkedInUrl: FieldSchema,
    name: FieldSchema,
    website: FieldSchema,
    phone: ArraySchema,
    address: FieldSchema,
    employees: FieldSchema,
    location: FieldSchema,
    industry: FieldSchema,
    keywords: FieldSchema,
    facebook: FieldSchema,
    twitter: FieldSchema,
    city: FieldSchema,
    state: FieldSchema,
    country: FieldSchema,
    seoDescription: FieldSchema,
    // technologies: FieldSchema,
    // annualRevenue: FieldSchema,
    // totalFunding: FieldSchema,
    // latestFunding: FieldSchema,
    // latestFundingAmount: FieldSchema,
    // lastRaisedAt: FieldSchema,
    // Add other company fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
