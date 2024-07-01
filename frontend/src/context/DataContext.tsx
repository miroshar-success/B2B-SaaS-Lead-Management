"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface DataContextType {
  leadResults: any[];
  companyResults: any[];
  setLeadResults: React.Dispatch<React.SetStateAction<any[]>>;
  setCompanyResults: React.Dispatch<React.SetStateAction<any[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leadResults, setLeadResults] = useState<any[]>([]);
  const [companyResults, setCompanyResults] = useState<any[]>([]);

  return (
    <DataContext.Provider
      value={{ leadResults, companyResults, setLeadResults, setCompanyResults }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
