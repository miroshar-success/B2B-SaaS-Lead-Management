const Company = require("../models/company.model");

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters for use in a regex
};

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

exports.findAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      sortBy = "createdAt",
      order = "asc",
      search = "",
      filter = "{}",
    } = req.query;

    // Convert filter to JSON
    const parsedFilter = JSON.parse(filter);

    // Search and Filter
    const searchRegex = new RegExp(escapeRegExp(search), "i");
    const searchConditions = {
      $or: [
        { "firstName.value": searchRegex },
        { "lastName.value": searchRegex },
        { "email.value": searchRegex },
        { "title.value": searchRegex },
        { "jobTitle.value": searchRegex },
        { "city.value": searchRegex },
        { "state.value": searchRegex },
        { "country.value": searchRegex },
        { "linkedInUrl.value": searchRegex },
        { "facebook.value": searchRegex },
        { "twitter.value": searchRegex },
      ],
    };

    // Apply filter conditions for each field with include and exclude values
    for (const [key, filterValues] of Object.entries(parsedFilter)) {
      const { include = "", exclude = "", isKnown, isNotKnown } = filterValues;
      console.log(include, exclude, isKnown, isNotKnown);

      // Handle 'is known' filter
      if (isKnown === true) {
        searchConditions[key] = { $exists: true, $ne: null };
        continue; // Skip to next filter, ignoring include/exclude
      }
      console.log("isknown false");
      // Handle 'is not known' filter
      if (isNotKnown === true) {
        searchConditions[key] = { $exists: false };
        continue; // Skip to next filter, ignoring include/exclude
      }
      console.log("both false");

      const includeArray = include
        .split(",")
        .map((value) => escapeRegExp(value.trim()))
        .filter(Boolean);
      const excludeArray = exclude
        .split(",")
        .map((value) => escapeRegExp(value.trim()))
        .filter(Boolean);
      console.log(includeArray, excludeArray);

      if (includeArray.length > 0) {
        searchConditions[key] = {
          $in: includeArray.map((val) => new RegExp(val, "i")),
        };
      }
      if (excludeArray.length > 0) {
        searchConditions[key] = {
          ...(searchConditions[key] || {}),
          $nin: excludeArray.map((val) => new RegExp(val, "i")),
        };
      }
    }

    // Pagination and Sorting
    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { [sortBy]: order === "asc" ? 1 : -1 },
    };

    const companies = await Company.find(searchConditions, null, options);
    const totalCompanies = await Company.countDocuments(searchConditions);

    res.send({
      companies,
      totalPages: Math.ceil(totalCompanies / limit),
      currentPage: parseInt(page),
      totalCompanies,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving companies.",
    });
    console.log(err);
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
    res.status(200).send({
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

// Controller function to search leads by a specific field with a limit
exports.searchCompanies = async (req, res) => {
  try {
    const { field, value, limit } = req.query;

    // Validate the input
    if (!field) {
      return res
        .status(400)
        .json({ error: "Field is required for searching." });
    }

    // Construct the search query using dynamic field access
    const query = { [`${field}.value`]: new RegExp(escapeRegExp(value), "i") };
    let companies;
    // Perform the search with a limit
    if (value) {
      companies = await Company.distinct(`${field}.value`, query);
    } else {
      companies = await Company.distinct(`${field}.value`);
    }
    const limitedResults = companies.slice(0, parseInt(limit, 10) || 10);

    // Return the matching companies
    res.status(200).json(limitedResults);
  } catch (error) {
    console.error("Error searching companies:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching companies." });
  }
};
