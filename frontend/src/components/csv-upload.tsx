// pages/admin/csv-upload.tsx
import { useState } from 'react';
import Papa from 'papaparse';

interface Lead {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId: string;
  linkedInUrl?: string;
  status: 'active' | 'inactive';
}

const CSVUploadPage = () => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCSVFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        const data = results.data as any[];
        const mappedLeads: Lead[] = data.map((row) => ({
          firstName: row['Full name']?.split(' ')[0] || '',
          lastName: row['Full name']?.split(' ')[1] || '',
          email: row['Emails'] || '',
          phone: row['Mobile'] || '',
          companyId: row['Company Name'] || '',
          linkedInUrl: row['LinkedIn URL'] || '',
          status: 'active', // Default status
        }));
        setLeads(mappedLeads);
      },
    });
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          CSV Upload Dashboard
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </label>
        <div>
          <button type="button" onClick={handleUpload}>
            Upload CSV
          </button>
        </div>
      </form>

      <div>
        <h2>Leads</h2>
        {leads.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>LinkedIn URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index}>
                  <td>{lead.firstName}</td>
                  <td>{lead.lastName}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.companyId}</td>
                  <td>{lead.linkedInUrl}</td>
                  <td>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CSVUploadPage;
