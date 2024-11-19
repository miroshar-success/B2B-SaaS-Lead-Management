// src/pages/Leads.tsx
import React, { useState } from "react";
import People from "../../components/tables/People";
import Companies from "../../components/tables/Companies";

export interface Lead {
  _id: string;
  linkedInUrl: { value: string };
  firstName: { value: string };
  lastName: { value: string };
  email: { value: string };
  company: { value: string };
  jobTitle: { value: string };
  country: { value: string };
  // Add other fields as needed
}

const Leads: React.FC = () => {
  const [tab, setTab] = useState("People");

  return (
    <div className=" relative h-[calc(100vh-65px)] bg-gray-100 p-4">
      <div className="bg-white p-3 pb-0 mb-3 rounded-md">
        <div className="text-xl md:text-3xl font-bold mb-4">Search</div>
        <div className="flex gap-5">
          <div
            className={`cursor-pointer${
              tab === "People" &&
              "font-medium border-b-2 pb-2  border-primary  "
            }`}
            onClick={() => setTab("People")}
          >
            People
          </div>
          <div
            className={`cursor-pointer${
              tab === "Companies" &&
              "font-medium border-b-2 pb-2  border-primary  "
            }`}
            onClick={() => setTab("Companies")}
          >
            Companies
          </div>
        </div>
      </div>
      {tab === "People" && <People />}
      {tab === "Companies" && <Companies />}
    </div>
  );
};

export default Leads;
