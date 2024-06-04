// pages/admin/csv-upload.tsx
import { useState } from 'react';

interface Lead {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId: string;
  linkedInUrl?: string;
  status: 'active' | 'inactive';
}

interface Company {
  name: string;
  linkedInUrl: string;
  companyId: string;
  // Add other company fields as needed
}

const CSVUploadPage = () => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCSVFile(e.target.files[0]);
    }
  };

  const handleFieldMapping = (csvField: string, databaseField: string) => {
    setFieldMappings((prevMappings) => ({
      ...prevMappings,
      [csvField]: databaseField,
    }));
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    // Create a FormData object and append the CSV file
    const formData = new FormData();
    formData.append('csvFile', csvFile);

    // Append the field mappings
    for (const [csvField, databaseField] of Object.entries(fieldMappings)) {
      formData.append(`fieldMappings[${csvField}]`, databaseField);
    }

    try {
      // Send a POST request to your backend API with the FormData
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('CSV uploaded successfully');
      } else {
        console.error('Error uploading CSV');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <label>
          CSV Upload Dashboard
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </label>
        <div>
          <h2>Field Mappings</h2>
          {/* Add field mapping inputs here */}
          <button>Upload CSV</button>
        </div>
      </form>
    </div>
  );
};

export default CSVUploadPage;