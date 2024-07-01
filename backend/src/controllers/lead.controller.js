const Lead = require("../models/lead.model");
const InCompleteLead = require("../models/inCompleteLead.model");

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
    // Check if the linkedInUrl is present
    if (!leadData.linkedInUrl.value) {
      console.warn("Missing LinkedIn Url for lead:", leadData);

      // Check if the lead exists in the IncompleteLead table
      const existingIncompleteLead = await IncompleteLead.findOne({
        "email.value": leadData.email.value,
      });

      if (existingIncompleteLead) {
        for (const key in leadData) {
          existingIncompleteLead[key] = updateFieldIfNewer(
            existingIncompleteLead[key],
            leadData[key].value,
            leadData[key].lastUpdated
          );
        }
        await existingIncompleteLead.save();
        return res
          .status(200)
          .send({ message: "Lead updated in incomplete", lead: leadData });
      } else {
        const incompleteLead = new IncompleteLead(leadData);
        await incompleteLead.save();
        return res
          .status(201)
          .send({ message: "Lead created in incomplete", lead: leadData });
      }
    }

    // Check if the lead exists in the IncompleteLead table and has now a linkedInUrl
    const existingIncompleteLead = await IncompleteLead.findOne({
      "email.value": leadData.email.value,
    });
    if (existingIncompleteLead) {
      await IncompleteLead.deleteOne({ _id: existingIncompleteLead._id });
      const lead = new Lead(leadData);
      const data = await lead.save();
      return res
        .status(201)
        .send({ message: "Lead moved from incomplete to lead", lead: data });
    }

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
      await existingLead.save();
      return res.status(200).send({ message: "Lead updated", lead: leadData });
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
    const leads = await Lead.find();
    res.send(leads);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving leads.",
    });
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

    const updatedLead = await existingLead.save();

    res.send({ message: "Lead was updated successfully.", lead: updatedLead });
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
      return res.status(404).send({
        message: `Cannot delete Lead with id=${id}. Maybe Lead was not found!`,
      });
    }

    res.send({ message: "Lead was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Couldn't delete Lead with id=" + id });
  }
};
