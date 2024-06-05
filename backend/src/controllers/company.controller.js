const Company = require('../models/company.model');

// Create and save a new company
exports.create = async (req, res) => {
  try {
    const company = new Company({
      name: req.body.name,
      linkedInUrl: req.body.linkedInUrl,
      companyId: req.body.companyId,
      address: req.body.address,
      website: req.body.website,
      phone: req.body.phone,
      employees: req.body.employees,
      retailLocation: req.body.retailLocation,
      industry: req.body.industry,
      keywords: req.body.keywords,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      seoDescription: req.body.seoDescription,
      technologies: req.body.technologies,
      annualRevenue: req.body.annualRevenue,
      totalFunding: req.body.totalFunding,
      latestFunding: req.body.latestFunding,
      latestFundingAmount: req.body.latestFundingAmount,
      lastRaisedAt: req.body.lastRaisedAt,
    });

    const savedCompany = await company.save();
    res.status(201).send(savedCompany);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Find all companies
exports.findAll = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Find a single company by ID
exports.findOne = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a company by ID
exports.update = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a company by ID
exports.delete = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }
    res.status(200).send({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
