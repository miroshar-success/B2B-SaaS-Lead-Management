import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useData } from "@/context/DataContext";

export interface CSVRow {
  [key: string]: string;
}

const leadFields = [
  "LinkedIn UrL",
  "First Name",
  "Last Name",
  "Email",
  "First Phone",
  "Title",
  "Job Title",
  "Seniority",
  "Departments",
  "Work Phone",
  "Home Phone",
  "Mobile Phone",
  "Other Phone",
  "City",
  "State",
  "Country",
  "Facebook",
  "Twitter",
  "Past Companies",
  "Last Updated",
];

const companyFields = [
  "Company Linkedin Url",
  "Company Name",
  "Company Website",
  "Phone numbers",
  "Address",
  "Employees",
  "Retail Location",
  "Industry",
  "Keywords",
  "Facebook",
  "Twitter",
  "City",
  "State",
  "Country",
  "SEO Description",
  "Technologies",
  "Annual Revenue",
  "Total Funding",
  "Latest Funding",
  "Latest Funding Amount",
  "Last Raised At",
];

const CSVUpload = () => {
  const { startUpload } = useData();
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>(
    {}
  );
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCSVData(results.data as CSVRow[]);
          setCsvHeaders(results.meta.fields || []);
        },
      });
    }
  };

  const handleFieldMapping = (csvField: string, databaseField: string) => {
    setFieldMappings((prevMappings) => ({
      ...prevMappings,
      [databaseField]: csvField,
    }));
  };

  const handleConfirm = () => {
    setError("");
    if (csvData.length === 0) {
      setError("Import a valid csv file");
      return;
    }
    startUpload(csvData, fieldMappings);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
        <input
          type="file"
          accept=".csv"
          title="csv title"
          onChange={handleFileChange}
          className="mb-4"
        />

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Lead Info:</h2>
          {leadFields.map((field, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">{field}:</label>
              <select
                title={`Select ${field}`}
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => handleFieldMapping(e.target.value, field)}
              >
                <option value="">Select {field}</option>
                {csvHeaders.map((header, idx) => (
                  <option key={idx} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Company Info:</h2>
          {companyFields.map((field, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">{field}:</label>
              <select
                title={`Select ${field}`}
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => handleFieldMapping(e.target.value, field)}
              >
                <option value="">Select {field}</option>
                {csvHeaders.map((header, idx) => (
                  <option key={idx} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CSVUpload;
