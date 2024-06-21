import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

interface CSVRow {
  [key: string]: string;
}

const CSVUpload = () => {
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>({});
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [showProgressPopup, setShowProgressPopup] = useState<boolean>(false);
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

    setIsUploading(true);
    setShowProgressPopup(true);
    setTotal(csvData.length);

    const increment = 100 / csvData.length;

    for (let i = 0; i < csvData.length; i++) {
      // Simulate processing each row
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network latency
      setProgress((prevProgress) => prevProgress + increment);
    }

    try {
      const response = await axios.post('https://b2b-saas-lead-mangement-3.onrender.com/api/upload-csv', {
        csvData,
        fieldMappings,
      });

      const { recordsCreated, recordsUpdated, errors } = response.data;
      router.push(`/admin/upload-summary?recordsCreated=${recordsCreated}&recordsUpdated=${recordsUpdated}&errors=${errors}`);
    } catch (error) {
      console.error('Error uploading CSV:', error);
    } finally {
      setIsUploading(false);
      setShowProgressPopup(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
        <input type="file" accept=".csv" title='csv title'  onChange={handleFileChange} className="mb-4" />

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Lead Info:</h2>
          {['LinkedIn UrL', 'First Name', 'Last Name', 'Email', 'Last Updated'].map((field, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">{field}:</label>
              <select
                title={`Select ${field}`}
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => handleFieldMapping(e.target.value, field)}
              >
                <option value="">Select {field}</option>
                {csvHeaders.map((header, idx) => (
                  <option key={idx} value={header}>{header}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Company Info:</h2>
          {['Company Linkedin Url', 'Company Name', 'Company Website', 'Phone numbers'].map((field, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">{field}:</label>
              <select
                title={`Select ${field}`}
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => handleFieldMapping(e.target.value, field)}
              >
                <option value="">Select {field}</option>
                {csvHeaders.map((header, idx) => (
                  <option key={idx} value={header}>{header}</option>
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
            <p className="mb-4">Fetching {Math.round(progress)}% of {total} records</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button
              onClick={() => setShowProgressPopup(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CSVUpload;
