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
    try {
      const response = await axios.post('http://localhost:5000/api/upload-csv', {
        csvData,
        fieldMappings,
      });

      const { recordsCreated, recordsUpdated, errors } = response.data;
      router.push(`/admin/upload-summary?recordsCreated=${recordsCreated}&recordsUpdated=${recordsUpdated}&errors=${errors}`);
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
        <input type="file" accept=".csv" title='csv title'  onChange={handleFileChange} className="mb-4" />

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Lead Info:</h2>
          {['LinkedIn URL', 'First Name', 'Last Name', 'Email'].map((field, index) => (
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
          {['LinkedIn URL', 'Company Name', 'Website', 'Phone'].map((field, index) => (
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
    </div>
  );
};

export default CSVUpload;
