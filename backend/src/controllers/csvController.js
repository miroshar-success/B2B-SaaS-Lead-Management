const Lead = require("../models/lead.model");
const Company = require("../models/company.model");
const sanitize = require("sanitize-html");

const sanitizeValue = (value) => {
  return sanitize(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

const calculateTrustScore = (date) => {
  const today = new Date();
  const lastUpdateDate = new Date(date);
  const timeDiff = Math.abs(today - lastUpdateDate);
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - daysDiff);
};

const processCSVData = async (csvData, fieldMappings) => {
  let leadResults = [];
  let companyResults = [];

  const BATCH_SIZE = 500; // Define batch size
  const leadBulkOperations = [];
  const companyBulkOperations = [];

  // Prepare company data and bulk operations
  for (const row of csvData) {
    const companyData = {
      name: {
        value: sanitizeValue(row[fieldMappings["Company Name"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      linkedInUrl: {
        value: sanitizeValue(row[fieldMappings["Company Linkedin Url"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      address: {
        value: sanitizeValue(row[fieldMappings["Address"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      website: {
        value: sanitizeValue(row[fieldMappings["Company Website"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      phone: {
        value: sanitizeValue(row[fieldMappings["Phone"]])
          .split(",")
          .map((phone) => phone.trim()),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      employees: {
        value: sanitizeValue(row[fieldMappings["Employees"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      industry: {
        value: sanitizeValue(row[fieldMappings["Industry"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      keywords: {
        value: sanitizeValue(row[fieldMappings["Keywords"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      facebook: {
        value: sanitizeValue(row[fieldMappings["Facebook"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      twitter: {
        value: sanitizeValue(row[fieldMappings["Twitter"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      city: {
        value: sanitizeValue(row[fieldMappings["City"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      state: {
        value: sanitizeValue(row[fieldMappings["State"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      country: {
        value: sanitizeValue(row[fieldMappings["Country"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
      seoDescription: {
        value: sanitizeValue(row[fieldMappings["SEO Description"]]),
        lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
      },
    };

    const companyFilter = {
      "linkedInUrl.value": companyData.linkedInUrl.value,
    };
    const companyUpdate = { $set: companyData };
    companyBulkOperations.push({
      updateOne: {
        filter: companyFilter,
        update: companyUpdate,
        upsert: true,
      },
    });
    companyResults.push({ ...companyData, status: "created/updated" });
  }

  try {
    // Execute company bulk operations
    if (companyBulkOperations.length > 0) {
      const res = await Company.bulkWrite(companyBulkOperations);
    }
  } catch (error) {
    console.error("Error in company bulkWrite operations: ", error);
  }

  // Fetch existing companies from the database
  const existingCompanies = await Company.find(
    {},
    { _id: 1, "linkedInUrl.value": 1 }
  );

  // Create a map to store existing companies for quick lookup by LinkedIn URL
  const companyMap = new Map(
    existingCompanies.map((company) => [company.linkedInUrl.value, company._id])
  );

  // Process leads in batches
  for (let i = 0; i < csvData.length; i += BATCH_SIZE) {
    const batch = csvData.slice(i, i + BATCH_SIZE);

    for (const row of batch) {
      const leadData = {
        linkedInUrl: {
          value: sanitizeValue(row[fieldMappings["LinkedIn UrL"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        firstName: {
          value: sanitizeValue(row[fieldMappings["First Name"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        lastName: {
          value: sanitizeValue(row[fieldMappings["Last Name"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        email: {
          value: sanitizeValue(row[fieldMappings["Email"]])
            .split(",")
            .map((email) => email.trim()),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        phone: {
          value: sanitizeValue(row[fieldMappings["Phone"]])
            .split(",")
            .map((phone) => phone.trim()),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        jobTitle: {
          value: sanitizeValue(row[fieldMappings["Job Title"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        level: {
          value: sanitizeValue(row[fieldMappings["Management Level"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        departments: {
          value: sanitizeValue(row[fieldMappings["Departments"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        city: {
          value: sanitizeValue(row[fieldMappings["City"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        state: {
          value: sanitizeValue(row[fieldMappings["State"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        country: {
          value: sanitizeValue(row[fieldMappings["Country"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        facebook: {
          value: sanitizeValue(row[fieldMappings["Facebook"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        twitter: {
          value: sanitizeValue(row[fieldMappings["Twitter"]]),
          lastUpdated: sanitizeValue(row[fieldMappings["Last Updated"]]),
        },
        companyID:
          companyMap.get(
            sanitizeValue(row[fieldMappings["Company Linkedin Url"]])
          ) || "",
        isComplete: !!row[fieldMappings["LinkedIn UrL"]],
      };

      // Lead Data Processing
      if (!leadData.linkedInUrl.value) {
        const filter = {
          "email.value": { $in: leadData.email.value },
        };
        const update = { $set: leadData };
        const upsert = true;
        leadBulkOperations.push({
          updateOne: { filter, update, upsert },
        });
        leadResults.push({
          ...leadData,
          status: "created/updated",
          reason: "Missing LinkedIn Url",
        });
      } else if (leadData.firstName.value || leadData.lastName.value) {
        const leadFilter = {
          $or: [
            { "email.value": { $in: leadData.email.value } },
            { "linkedInUrl.value": leadData.linkedInUrl.value },
          ],
        };
        const leadUpdate = { $set: leadData };
        leadBulkOperations.push({
          updateOne: {
            filter: leadFilter,
            update: leadUpdate,
            upsert: true,
          },
        });
        leadResults.push({ ...leadData, status: "created/updated" });
      } else {
        leadResults.push({
          ...leadData,
          status: "error",
          reason: "Missing first name or last name",
        });
      }
    }

    try {
      // Execute lead bulk operations for the current batch
      if (leadBulkOperations.length > 0) {
        await Lead.bulkWrite(leadBulkOperations);
      }
    } catch (error) {
      console.error("Error in lead bulkWrite operations: ", error);
    }

    // Clear bulk operations for next batch
    leadBulkOperations.length = 0;
  }

  return { leadResults, companyResults };
};

module.exports = { processCSVData };
