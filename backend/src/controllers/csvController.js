const Lead = require("../models/lead.model");
const Company = require("../models/company.model");
const InCompleteLead = require("../models/inCompleteLead.model");

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

  const leadBulkOperations = [];
  const incompleteLeadBulkOperations = [];
  const companyBulkOperations = [];

  for (const row of csvData) {
    const leadData = {
      linkedInUrl: {
        value: row[fieldMappings["LinkedIn UrL"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      firstName: {
        value: row[fieldMappings["First Name"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      lastName: {
        value: row[fieldMappings["Last Name"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      email: {
        value: row[fieldMappings["Email"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      firstPhone: {
        value: row[fieldMappings["First Phone"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      title: {
        value: row[fieldMappings["Title"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      jobTitle: {
        value: row[fieldMappings["Job Title"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      seniority: {
        value: row[fieldMappings["Seniority"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      departments: {
        value: row[fieldMappings["Departments"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      workPhone: {
        value: row[fieldMappings["Work Phone"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      homePhone: {
        value: row[fieldMappings["Home Phone"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      mobilePhone: {
        value: row[fieldMappings["Mobile Phone"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      otherPhone: {
        value: row[fieldMappings["Other Phone"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      city: {
        value: row[fieldMappings["City"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      state: {
        value: row[fieldMappings["State"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      country: {
        value: row[fieldMappings["Country"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      facebook: {
        value: row[fieldMappings["Facebook"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      twitter: {
        value: row[fieldMappings["Twitter"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      pastCompanies: {
        value: row[fieldMappings["Past Companies"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
    };

    const companyData = {
      name: {
        value: row[fieldMappings["Company Name"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      linkedInUrl: {
        value: row[fieldMappings["Company Linkedin Url"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      address: {
        value: row[fieldMappings["Address"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      website: {
        value: row[fieldMappings["Company Website"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      phone: {
        value: row[fieldMappings["Phone numbers"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      employees: {
        value: row[fieldMappings["Employees"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      retailLocation: {
        value: row[fieldMappings["Retail Location"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      industry: {
        value: row[fieldMappings["Industry"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      keywords: {
        value: row[fieldMappings["Keywords"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      facebook: {
        value: row[fieldMappings["Facebook"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      twitter: {
        value: row[fieldMappings["Twitter"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      city: {
        value: row[fieldMappings["City"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      state: {
        value: row[fieldMappings["State"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      country: {
        value: row[fieldMappings["Country"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      seoDescription: {
        value: row[fieldMappings["SEO Description"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      technologies: {
        value: row[fieldMappings["Technologies"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      annualRevenue: {
        value: row[fieldMappings["Annual Revenue"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      totalFunding: {
        value: row[fieldMappings["Total Funding"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      latestFunding: {
        value: row[fieldMappings["Latest Funding"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      latestFundingAmount: {
        value: row[fieldMappings["Latest Funding Amount"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
      lastRaisedAt: {
        value: row[fieldMappings["Last Raised At"]],
        lastUpdated: row[fieldMappings["Last Updated"]],
      },
    };

    // Lead Data Processing
    if (!leadData.linkedInUrl.value) {
      const filter = { "email.value": leadData.email.value };
      const update = { $set: leadData };
      const upsert = true;
      incompleteLeadBulkOperations.push({
        updateOne: { filter, update, upsert },
      });
      leadResults.push({
        ...leadData,
        status: "created in incomplete",
        reason: "Missing LinkedIn Url",
      });
    } else {
      const incompleteLeadFilter = { "email.value": leadData.email.value };
      incompleteLeadBulkOperations.push({
        deleteOne: { filter: incompleteLeadFilter },
      });

      const leadFilter = {
        $or: [
          { "email.value": leadData.email.value },
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
    }

    // Company Data Processing
    const companyFilter = {
      "linkedInUrl.value": companyData.linkedInUrl.value,
    };
    const companyUpdate = { $set: companyData };
    const companyOptions = { upsert: true };
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
    const results = await Promise.all([
      InCompleteLead.bulkWrite(incompleteLeadBulkOperations),
      Lead.bulkWrite(leadBulkOperations),
      Company.bulkWrite(companyBulkOperations),
    ]);
  } catch (error) {
    console.error("Error in bulkWrite operations: ", error);
  }

  return { leadResults, companyResults };
};

module.exports = { processCSVData };
