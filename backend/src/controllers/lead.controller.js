const Lead = require("../models/lead.model");
const moment = require("moment");

exports.create = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email) {
    return res.status(400).send({ message: "Name and email are required" });
  }

  const currentDate = new Date();

  const leadData = {
    linkedInUrl: {
      value: req.body.linkedInUrl,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    firstName: {
      value: req.body.firstName,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    lastName: {
      value: req.body.lastName,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    email: {
      value: req.body.email,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    title: {
      value: req.body.title,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    jobTitle: {
      value: req.body.jobTitle,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    seniority: {
      value: req.body.seniority,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    departments: {
      value: req.body.departments,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    workPhone: {
      value: req.body.workPhone,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    city: {
      value: req.body.city,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    state: {
      value: req.body.state,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    country: {
      value: req.body.country,
      lastUpdated: req.body.lastUpdated || currentDate,
    },
    isComplete: !!req.body.linkedInUrl,
  };

  const updateFieldIfNewer = (existingField, newValue, newDate) => {
    if (
      !existingField ||
      new Date(newDate) > new Date(existingField.lastUpdated)
    ) {
      return { value: newValue, lastUpdated: newDate };
    }
    return existingField;
  };

  try {
    // Check if the lead exists in the Lead table
    const existingLead = await Lead.findOne({
      $or: [
        { "email.value": leadData.email.value },
        { "linkedInUrl.value": leadData.linkedInUrl.value },
      ],
    });

    if (existingLead) {
      for (const key in leadData) {
        existingLead[key] = updateFieldIfNewer(
          existingLead[key],
          leadData[key].value,
          leadData[key].lastUpdated
        );
      }
      existingLead.isComplete = !!leadData.linkedInUrl.value; // Update isComplete field
      await existingLead.save();
      return res
        .status(200)
        .send({ message: "Lead updated", lead: existingLead });
    } else {
      const lead = new Lead(leadData);
      const data = await lead.save();
      return res.status(201).send({ message: "Lead created", lead: data });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Lead.",
    });
  }
};

// Retrieve all Leads from the database
exports.findAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "asc",
      search = "",
      filter = "{}",
    } = req.query;

    // Convert filter to JSON

    // Search and Filter
    const searchRegex = new RegExp(search, "i");
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
      // ...filter,
    };

    // Pagination and Sorting
    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
      sort: { [sortBy]: order === "asc" ? 1 : -1 },
    };

    const leads = await Lead.find(searchConditions, null, options).populate(
      "companyID"
    );
    const totalLeads = await Lead.countDocuments(searchConditions);

    res.send({
      leads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: parseInt(page),
      totalLeads,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving leads.",
    });
    console.log(err);
  }
};

// Retrieve all Leads from the database
exports.getLinkedin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Search and Filter
    const searchRegex = new RegExp(search, "i");

    const searchConditions = {
      $or: [{ "linkedInUrl.value": searchRegex }],
      // ...filter,
    };

    // Pagination and Sorting
    const options = {
      skip: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
    };

    const leads = await Lead.find(searchConditions, null, options);
    const totalLeads = await Lead.countDocuments(searchConditions);

    res.send({
      leads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: parseInt(page),
      totalLeads,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving leads.",
    });
    console.log(err);
  }
};

// Find a single Lead with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).send({ message: "Lead not found with id " + id });
    }
    res.send(lead);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Lead with id=" + id });
  }
};

// Update a Lead by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty!" });
  }

  const id = req.params.id;
  const currentDate = new Date();

  const updateData = {};
  for (const [key, value] of Object.entries(req.body)) {
    updateData[key] = {
      value: value.value || value,
      lastUpdated: value.lastUpdated || currentDate,
    };
  }

  const updateFieldIfNewer = (existingField, newValue, newDate) => {
    if (
      !existingField ||
      new Date(newDate) > new Date(existingField.lastUpdated)
    ) {
      return { value: newValue, lastUpdated: newDate };
    }
    return existingField;
  };

  try {
    const existingLead = await Lead.findById(id);

    if (!existingLead) {
      return res.status(404).send({
        message: `Cannot update Lead with id=${id}. Maybe Lead was not found!`,
      });
    }

    for (const key in updateData) {
      existingLead[key] = updateFieldIfNewer(
        existingLead[key],
        updateData[key].value,
        updateData[key].lastUpdated
      );
    }

    // Update the isComplete field based on the presence of the LinkedIn URL
    existingLead.isComplete = !!updateData.linkedInUrl.value;

    const updatedLead = await existingLead.save();

    res.send({ message: "Lead was updated successfully.", lead: updatedLead });
  } catch (err) {
    res.status(500).send({ message: "Error updating Lead with id=" + id });
  }
};

// Get dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalLeadsToday = await Lead.countDocuments({
      createdAt: { $gte: today },
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const totalLeadsThisMonth = await Lead.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const totalLeadsThisWeek = await Lead.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    const leadsPerMonth = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const leadsPerJobTitle = await Lead.aggregate([
      {
        $group: {
          _id: "$jobTitle.value",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const leadSource = await Lead.aggregate([
      {
        $group: {
          _id: "$linkedInUrl.value",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      totalLeads,
      totalLeadsToday,
      totalLeadsThisMonth,
      totalLeadsThisWeek,
      leadsPerMonth,
      leadsPerJobTitle,
      leadSource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to search leads by a specific field with a limit
exports.searchLeads = async (req, res) => {
  try {
    const { field, value, limit } = req.query;

    // Validate the input
    if (!field || !value) {
      return res
        .status(400)
        .json({ error: "Field and value are required for searching." });
    }

    // Construct the search query using dynamic field access
    const query = { [`${field}.value`]: new RegExp(value, "i") };

    // Parse the limit parameter or set a default
    const resultLimit = parseInt(limit, 10) || 10; // Default limit is 10 if not provided or invalid

    // Perform the search with a limit
    const leads = await Lead.find(query).limit(resultLimit);

    // Return the matching leads
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error searching leads:", error);
    res.status(500).json({ error: "An error occurred while searching leads." });
  }
};

// Delete a Lead with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const lead = await Lead.findByIdAndRemove(id, { useFindAndModify: false });
    console.log(lead);

    if (!lead) {
      return res.status(404).send({
        message: `Cannot delete Lead with id=${id}. Maybe Lead was not found!`,
      });
    }

    res.send({ message: "Lead was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Couldn't delete Lead with id=" + id });
  }
};
