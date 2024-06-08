// components/LeadCard.tsx
import React from 'react';

interface Lead {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId: string;
  linkedInUrl?: string;
  status: 'active' | 'inactive';
  trustScore: number;
}

const LeadCard: React.FC<Lead> = ({ firstName, lastName, email, phone, companyId, linkedInUrl, status, trustScore }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md mb-4 bg-white">
      <h3 className="text-xl font-bold mb-2">{firstName} {lastName}</h3>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Company:</strong> {companyId}</p>
      <p><strong>LinkedIn:</strong> <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{linkedInUrl}</a></p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Trust Score:</strong> {trustScore}</p>
    </div>
  );
};

export default LeadCard;
