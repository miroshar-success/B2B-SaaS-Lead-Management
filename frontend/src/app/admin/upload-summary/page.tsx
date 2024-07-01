// pages/upload-summary.tsx
"use client";

import { Suspense, useState } from "react";
import { useData } from "@/context/DataContext";
import { calculateStatistics, getStatusClass } from "@/utils/data";

const UploadSummary = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Summary</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientSection />
      </Suspense>
    </div>
  );
};

const ClientSection = () => {
  const { leadResults, companyResults } = useData();
  const [selectedTable, setSelectedTable] = useState<string>("lead");

  const data = selectedTable === "lead" ? leadResults : companyResults;
  const statistics = calculateStatistics(data);

  return (
    <div className="container mx-auto p-4">
      <ToggleTable
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />
      <div className="mt-4 flex justify-center">
        <div className="p-4 w-full">
          <p>Created: {statistics.created}</p>
          <p>Updated: {statistics.updated}</p>
          <p>Errors: {statistics.errors}</p>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              {selectedTable === "lead" ? (
                <>
                  <th className="w-1/6 px-4 py-2">LinkedIn URL</th>
                  <th className="w-1/12 px-4 py-2">First Name</th>
                  <th className="w-1/12 px-4 py-2">Last Name</th>
                  <th className="w-1/6 px-4 py-2">Email</th>
                  <th className="w-1/12 px-4 py-2">Company ID</th>
                  <th className="w-1/12 px-4 py-2">Status</th>
                </>
              ) : (
                <>
                  <th className="w-1/6 px-4 py-2">Company Name</th>
                  <th className="w-1/6 px-4 py-2">LinkedIn URL</th>
                  <th className="w-1/6 px-4 py-2">Website</th>
                  <th className="w-1/6 px-4 py-2">Phone Numbers</th>
                  <th className="w-1/12 px-4 py-2">Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-100">
                {selectedTable === "lead" ? (
                  <>
                    <td className="px-4 py-2">
                      <a
                        href={row.linkedInUrl.value}
                        className="text-blue-500 hover:underline"
                      >
                        {row.linkedInUrl.value}
                      </a>
                    </td>
                    <td className="px-4 py-2">{row.firstName?.value}</td>
                    <td className="px-4 py-2">{row.lastName?.value}</td>
                    <td className="px-4 py-2">{row.email?.value}</td>
                    <td className="px-4 py-2">{row.companyId?.value}</td>
                    <td className="px-4 py-2">{row.status}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{row.name?.value}</td>
                    <td className="px-4 py-2">
                      <a
                        href={row.linkedInUrl?.value}
                        className="text-blue-500 hover:underline"
                      >
                        {row.linkedInUrl?.value}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={row.website?.value}
                        className="text-blue-500 hover:underline"
                      >
                        {row.website?.value}
                      </a>
                    </td>
                    <td className="px-4 py-2">{row.phone?.value}</td>
                    <td className={`px-4 py-2  `}>
                      <div className={`bg-blue ${getStatusClass(row.status)}`}>
                        {row.status}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ToggleTableProps {
  selectedTable: string;
  setSelectedTable: (table: string) => void;
}

const ToggleTable: React.FC<ToggleTableProps> = ({
  selectedTable,
  setSelectedTable,
}) => {
  return (
    <div className="flex justify-center my-4">
      <button
        className={`px-4 py-2 mx-2 ${
          selectedTable === "lead" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setSelectedTable("lead")}
      >
        Lead Data
      </button>
      <button
        className={`px-4 py-2 mx-2 ${
          selectedTable === "company" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => setSelectedTable("company")}
      >
        Company Data
      </button>
    </div>
  );
};

export default UploadSummary;
