// pages/admin/csv-upload.tsx
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface Lead {
  linkedInUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId: string;
  companyName?: string;
  website?: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
  trustScore: number;
}

const CSVUploadPage = () => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvHeaders, setCSVHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>({});
  const [data, setData] = useState<any[]>([]);
  const [showMappings, setShowMappings] = useState(false);
  const [summary, setSummary] = useState<{ created: number; updated: number; errors: number }>({ created: 0, updated: 0, errors: 0 });

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

  const calculateTrustScore = (lastUpdated: string): number => {
    const today = new Date();
    const updatedDate = new Date(lastUpdated);
    const timeDiff = today.getTime() - updatedDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.round((1 - daysDiff / 365) * 100);
  };

  const handleProcessData = () => {
    let created = 0;
    let updated = 0;
    let errors = 0;

    const processedData = data.map((row) => {
      const newLead: Lead = {
        linkedInUrl: row[fieldMappings['linkedInUrl']],
        firstName: row[fieldMappings['firstName']],
        lastName: row[fieldMappings['lastName']],
        email: row[fieldMappings['email']],
        phone: row[fieldMappings['phone']],
        companyId: row[fieldMappings['companyId']],
        companyName: row[fieldMappings['companyName']],
        website: row[fieldMappings['website']],
        status: row[fieldMappings['linkedInUrl']] ? 'active' : 'inactive',
        lastUpdated: row[fieldMappings['Last Updated']],
        trustScore: calculateTrustScore(row[fieldMappings['Last Updated']]),
      };

      // Check if the lead already exists in local storage
      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const existingLead = existingLeads.find((lead: Lead) => lead.email === newLead.email || lead.linkedInUrl === newLead.linkedInUrl);

      if (existingLead) {
        // Update existing lead
        Object.assign(existingLead, newLead);
        updated++;
      } else {
        // Create new lead
        existingLeads.push(newLead);
        created++;
      }

      // Save updated leads back to local storage
      localStorage.setItem('leads', JSON.stringify(existingLeads));
      return newLead;
    });

    setSummary({ created, updated, errors });
    console.log(processedData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Upload</h1>
      <input type="file" accept=".csv" title='CSV file' onChange={handleFileChange} className="mb-4" />
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
                  title='lead dropdown'
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
                  title='company dropdown'
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

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <p>Records Created: {summary.created}</p>
            <p>Records Updated: {summary.updated}</p>
            <p>Errors: {summary.errors}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUploadPage;
