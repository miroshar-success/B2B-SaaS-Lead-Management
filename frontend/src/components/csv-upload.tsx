import React, { useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useData } from "@/context/DataContext";
import { calculateChunkSize } from "@/utils/data";

interface CSVRow {
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
  const { setCompanyResults, setLeadResults } = useData();
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>(
    {}
  );
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [showProgressPopup, setShowProgressPopup] = useState<boolean>(false);
  const [cancelSource, setCancelSource] = useState<CancelTokenSource | null>(
    null
  );
  const router = useRouter();

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

  const handleConfirm = async () => {
    const CHUNK_SIZE = 500;
    setIsUploading(true);
    setShowProgressPopup(true);
    setProgress(0);

    const totalChunks = Math.ceil(csvData.length / CHUNK_SIZE);
    setTotal(csvData.length);

    const chunks = [];
    for (let i = 0; i < totalChunks; i++) {
      chunks.push(csvData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }

    const source = axios.CancelToken.source();
    setCancelSource(source);

    try {
      let count = 1;
      const results = await Promise.all(
        chunks.map(async (chunk, index) => {
          const response = await axios.post(
            "https://b2b-saas-lead-mangement-main.onrender.com/api/upload-csv",
            {
              csvData: chunk,
              fieldMappings,
            },
            {
              cancelToken: source.token,
            }
          );
          setProgress((count / totalChunks) * 100);
          count += 1;
          return response.data;
        })
      );

      const leadResults: any[] = [];
      const companyResults: any[] = [];

      results.forEach(
        ({ leadResults: leadRes, companyResults: companyRes }) => {
          leadResults.push(...leadRes);
          companyResults.push(...companyRes);
        }
      );

      setLeadResults(leadResults);
      setCompanyResults(companyResults);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  const handleCancel = () => {
    if (cancelSource) {
      cancelSource.cancel("Upload cancelled by user");
    }
    setShowProgressPopup(false);
    setIsUploading(false);
    setProgress(0);
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

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>

      {/* Progress Popup */}
      {showProgressPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Uploading CSV</h2>
            <p className="mb-4">
              Fetching {Math.round(progress)}% of {total} records
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              {!isUploading && (
                <button
                  onClick={() => {
                    setShowProgressPopup(false);
                    router.push(`/admin/upload-summary`);
                  }}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  View Result
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
