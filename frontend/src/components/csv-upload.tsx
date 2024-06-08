// pages/admin/csv-upload.tsx
import { useState } from 'react';
import Papa from 'papaparse';
import LeadCard from '@/components/LeadCard';

interface Lead {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId: string;
  linkedInUrl?: string;
  status: 'active' | 'inactive';
  trustScore: number;
  lastUpdated: string; // Add this field for date parsing
}

const CSVUploadPage = () => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCSVFile(e.target.files[0]);
    }
  };

  const calculateTrustScores = (leads: Lead[]) => {
    const now = new Date();
    const recencyArray = leads.map(lead => {
      const date = new Date(lead.lastUpdated);
      return isNaN(date.getTime()) ? null : (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24); // recency in days
    }).filter(recency => recency !== null) as number[];

    const maxRecency = Math.max(...recencyArray);
    const minRecency = Math.min(...recencyArray);

    return leads.map(lead => {
      const date = new Date(lead.lastUpdated);
      const recency = isNaN(date.getTime()) ? null : (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      const trustScore = recency === null ? 0 :  Math.round(((maxRecency - recency) / (maxRecency - minRecency)) * 100);
      return { ...lead, trustScore };
    });
  };

  const handleUpload = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        const data = results.data as any[];
        const mappedLeads: Lead[] = data.map((row) => {
          const lastUpdated = row['Last Updated 2'] || ''; // Ensure correct column name
          return {
            firstName: row['Full name']?.split(' ')[0] || '',
            lastName: row['Full name']?.split(' ')[1] || '',
            email: row['Emails'] || '',
            phone: row['Mobile'] || '',
            companyId: row['Company Name'] || '',
            linkedInUrl: row['LinkedIn URL'] || '',
            status: 'active', // Default status
            lastUpdated,
            trustScore: 0, // Temporary trust score
          };
        });

        const leadsWithTrustScores = calculateTrustScores(mappedLeads);
        const sortedLeads = leadsWithTrustScores.sort((a, b) => b.trustScore - a.trustScore);
        setLeads(sortedLeads);
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <label className="block mb-2 text-lg font-medium text-gray-700">
          CSV Upload Dashboard
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        <button 
          type="button" 
          onClick={handleUpload} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload CSV
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4">Leads</h2>
        {leads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead, index) => (
              <LeadCard key={index} {...lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVUploadPage;
