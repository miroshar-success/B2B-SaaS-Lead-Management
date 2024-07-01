const Company = require("../models/company.model");

// Create and save a new company
exports.create = async (req, res) => {
  try {
    const currentDate = req.body.lastUpdated || new Date();
    const companyData = {
      name: { value: req.body.name, lastUpdated: currentDate },
      linkedInUrl: { value: req.body.linkedInUrl, lastUpdated: currentDate },
      address: { value: req.body.address, lastUpdated: currentDate },
      website: { value: req.body.website, lastUpdated: currentDate },
      phone: { value: req.body.phone, lastUpdated: currentDate },
      employees: { value: req.body.employees, lastUpdated: currentDate },
      retailLocation: {
        value: req.body.retailLocation,
        lastUpdated: currentDate,
      },
      industry: { value: req.body.industry, lastUpdated: currentDate },
      keywords: { value: req.body.keywords, lastUpdated: currentDate },
      facebook: { value: req.body.facebook, lastUpdated: currentDate },
      twitter: { value: req.body.twitter, lastUpdated: currentDate },
      city: { value: req.body.city, lastUpdated: currentDate },
      state: { value: req.body.state, lastUpdated: currentDate },
      country: { value: req.body.country, lastUpdated: currentDate },
      seoDescription: {
        value: req.body.seoDescription,
        lastUpdated: currentDate,
      },
      technologies: { value: req.body.technologies, lastUpdated: currentDate },
      annualRevenue: {
        value: req.body.annualRevenue,
        lastUpdated: currentDate,
      },
      totalFunding: { value: req.body.totalFunding, lastUpdated: currentDate },
      latestFunding: {
        value: req.body.latestFunding,
        lastUpdated: currentDate,
      },
      latestFundingAmount: {
        value: req.body.latestFundingAmount,
        lastUpdated: currentDate,
      },
      lastRaisedAt: { value: req.body.lastRaisedAt, lastUpdated: currentDate },
    };

    const company = new Company(companyData);
    const savedCompany = await company.save();
    return res
      .status(201)
      .send({ message: "Company created", company: savedCompany });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Company.",
    });
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
    const currentDate = req.body.lastUpdated || new Date();
    const newCompanyData = {};

    // Prepare newCompanyData with value and lastUpdated fields
    for (const [key, value] of Object.entries(req.body)) {
      newCompanyData[key] = { value, lastUpdated: currentDate };
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }

    // Update fields only if new data has a more recent lastUpdated date
    for (const [key, newValue] of Object.entries(newCompanyData)) {
      if (
        !company[key] ||
        new Date(newValue.lastUpdated) > new Date(company[key].lastUpdated)
      ) {
        company[key] = newValue;
      }
    }

    const updatedCompany = await company.save();
    res
      .status(200)
      .send({
        message: "Company updated successfully",
        company: updatedCompany,
      });
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
