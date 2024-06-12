import { useState } from 'react';
import { useRouter } from 'next/router';
import * as Papa from 'papaparse';

interface CSVRow {
  [key: string]: string | undefined;
}

const CSVUploadPage = () => {
  const [csvColumns, setCSVColumns] = useState<string[]>([]);
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      Papa.parse<CSVRow>(file, {
        header: true,
        complete: (results) => {
          const data = results.data;
          if (data.length > 0) {
            setCSVColumns(Object.keys(data[0]));
            setCSVData(data);
          }
        },
      });
    }
  };

  const handleFieldMapping = (databaseField: string, csvField: string) => {
    setFieldMappings((prevMappings) => ({
      ...prevMappings,
      [databaseField]: csvField,
    }));
  };

  const calculateTrustScore = (date: string) => {
    const now = new Date();
    const parsedDate = new Date(date);
    const timeDifference = Math.abs(now.getTime() - parsedDate.getTime());
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return Math.max(0, 100 - daysDifference); // Example calculation
  };

  const handleUpload = async () => {
    const processedData = csvData.map((row) => {
      return {
        linkedInUrl: row[fieldMappings['LinkedIn URL']] || '',
        firstName: row[fieldMappings['First Name']] || '',
        lastName: row[fieldMappings['Last Name']] || '',
        email: row[fieldMappings['Email']] || '',
        companyId: row[fieldMappings['Company ID']] || '',
        status: row[fieldMappings['LinkedIn URL']] ? 'active' : 'inactive',
        trustScore: calculateTrustScore(row[fieldMappings['Last Updated']] || ''),
      };
    });

    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Summary:', result);
        router.push('/admin/upload-summary'); // Redirect to summary page
      } else {
        console.error('Error uploading CSV');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" title="Upload your CSV file here" />
      {csvColumns.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold">Lead Info:</h2>
            {['LinkedIn URL', 'First Name', 'Last Name', 'Email', 'Last Updated'].map((field) => (
              <div key={field} className="mb-2">
                <label className="block font-semibold">{field}</label>
                <select
                  onChange={(e) => handleFieldMapping(field, e.target.value)}
                  className="border rounded p-2 w-full"
                  defaultValue=""
                  title={`Select the CSV column for ${field}`}
                >
                  <option value="" disabled>Select CSV Column</option>
                  {csvColumns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold">Company Info:</h2>
            {['Company Name', 'Company LinkedIn URL', 'Website', 'Company Phone'].map((field) => (
              <div key={field} className="mb-2">
                <label className="block font-semibold">{field}</label>
                <select
                  onChange={(e) => handleFieldMapping(field, e.target.value)}
                  className="border rounded p-2 w-full"
                  defaultValue=""
                  title={`Select the CSV column for ${field}`}
                >
                  <option value="" disabled>Select CSV Column</option>
                  {csvColumns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
        title="Confirm and upload the mapped data"
      >
        Confirm
      </button>
    </div>
  );
};

export default CSVUploadPage;
