// pages/admin/csv-upload.tsx
import { useState, useEffect } from 'react';
import Papa from 'papaparse';


export interface Lead {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId: string;
  linkedInUrl?: string;
  status: 'active' | 'inactive';
  trustScore: number;
  lastUpdated: string;
}

const CSVUploadPage = () => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvHeaders, setCSVHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<any[]>([]);
  const [showMappings, setShowMappings] = useState(false);

  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      setData(JSON.parse(storedLeads));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCSVFile(file);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = results.meta.fields as string[];
          setCSVHeaders(headers);
          setData(results.data);
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

  const handleUpload = () => {
    setShowMappings(true);
  };

  const handleProcessData = () => {
    const processedData = data.map((row) => {
      return {
        linkedInUrl: row[fieldMappings['linkedInUrl']],
        firstName: row[fieldMappings['firstName']],
        lastName: row[fieldMappings['lastName']],
        email: row[fieldMappings['email']],
        companyId: row[fieldMappings['companyId']],
        companyName: row[fieldMappings['companyName']],
        website: row[fieldMappings['website']],
        phone: row[fieldMappings['phone']],
        status: row[fieldMappings['linkedInUrl']] ? 'active' : 'inactive',
        lastUpdated: row[fieldMappings['lastUpdated']],
        trustScore: 0, // Temporary trust score, calculation can be added
      };
    });

    console.log(processedData);
    // Process data and save to local storage or send to backend
    localStorage.setItem('leads', JSON.stringify(processedData));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Upload</h1>
      <input type="file" accept=".csv" title='csv file' onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-yellow-500 text-white py-2 px-4 rounded">Upload CSV</button>

      {showMappings && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Field Mappings</h2>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Lead Info:</h3>
            {['linkedInUrl', 'firstName', 'lastName', 'email'].map((dbField) => (
              <div key={dbField} className="mb-2">
                <label className="mr-2">{dbField}:</label>
                <select
                  onChange={(e) => handleFieldMapping(e.target.value, dbField)}
                  className="p-2 border border-gray-300 rounded"
                  title='lead fields'
                >
                  <option value="">Select a field</option>
                  {csvHeaders.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Company Info:</h3>
            {['companyId', 'companyName', 'website', 'phone'].map((dbField) => (
              <div key={dbField} className="mb-2">
                <label className="mr-2">{dbField}:</label>
                <select
                  onChange={(e) => handleFieldMapping(e.target.value, dbField)}
                  className="p-2 border border-gray-300 rounded"
                  title='company fields'
                >
                  <option value="">Select a field</option>
                  {csvHeaders.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button onClick={handleProcessData} className="bg-green-500 text-white py-2 px-4 rounded">Confirm</button>
        </div>
      )}
    </div>
  );
};

export default CSVUploadPage;
