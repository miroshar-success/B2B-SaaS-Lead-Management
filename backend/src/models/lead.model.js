const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  value: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

const ArraySchema = new mongoose.Schema({
  value: { type: [String] },
  lastUpdated: { type: Date, default: Date.now },
});

const LevelSchema = new mongoose.Schema({
  value: {
    type: String,
    enum: [
      "Owner",
      "Founder",
      "C suite",
      "Partner",
      "Vp",
      "Head",
      "Director",
      "Manager",
      "Senior",
      "Entry",
      "Intern",
    ],
  },
  lastUpdated: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema(
  {
    linkedInUrl: FieldSchema,
    firstName: FieldSchema,
    lastName: FieldSchema,
    email: ArraySchema,
    phone: ArraySchema,
    // firstPhone: FieldSchema,
    // title: FieldSchema,
    jobTitle: FieldSchema,
    industry: FieldSchema,
    level: FieldSchema,
    departments: FieldSchema,
    // workPhone: FieldSchema,
    // homePhone: FieldSchema,
    // mobilePhone: FieldSchema,
    // otherPhone: FieldSchema,
    city: FieldSchema,
    state: FieldSchema,
    country: FieldSchema,
    facebook: FieldSchema,
    twitter: FieldSchema,
    gender: FieldSchema,
    // pastCompanies: FieldSchema,
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    isComplete: { type: Boolean },
    // Add other company fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
