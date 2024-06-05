const Lead = require('../models/lead.model');

// Create and Save a new Lead
exports.create = async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email) {
    return res.status(400).send({ message: "Name and email are required" });
  }

  const lead = new Lead({
    linkedInUrl: req.body.linkedInUrl,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    companyId: req.body.companyId,
    contactId: req.body.contactId,
    email: req.body.email,
    title: req.body.title,
    jobTitle: req.body.jobTitle,
    seniority: req.body.seniority,
    departments: req.body.departments,
    workPhone: req.body.workPhone,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country
  });

  try {
    const data = await lead.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while creating the Lead." });
  }
};

// Retrieve all Leads from the database
exports.findAll = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.send(leads);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving leads." });
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
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  const id = req.params.id;

  try {
    const lead = await Lead.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true });

    if (!lead) {
      return res.status(404).send({ message: `Cannot update Lead with id=${id}. Maybe Lead was not found!` });
    }

    res.send({ message: "Lead was updated successfully.", lead });
  } catch (err) {
    res.status(500).send({ message: "Error updating Lead with id=" + id });
  }
};

// Delete a Lead with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const lead = await Lead.findByIdAndRemove(id, { useFindAndModify: false });
    console.log(lead);

    if (!lead) {
      return res.status(404).send({ message: `Cannot delete Lead with id=${id}. Maybe Lead was not found!` });
    }

    res.send({ message: "Lead was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Couldn't delete Lead with id=" + id });
  }
};
