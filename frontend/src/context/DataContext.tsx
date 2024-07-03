"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import axios, { CancelTokenSource } from "axios";
import { CSVRow } from "@/components/csv-upload";
import {
  FaCloudUploadAlt,
  FaRegWindowMaximize,
  FaRegWindowMinimize,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FaMinimize } from "react-icons/fa6";

interface DataContextType {
  leadResults: any[];
  companyResults: any[];
  startUpload: (
    csvData: CSVRow[],
    fieldMappings: { [key: string]: string }
  ) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [leadResults, setLeadResults] = useState<any[]>([]);
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [showProgressPopup, setShowProgressPopup] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [cancelSource, setCancelSource] = useState<CancelTokenSource | null>(
    null
  );
  const router = useRouter();

  const startUpload = async (
    csvData: CSVRow[],
    fieldMappings: { [key: string]: string }
  ) => {
    const CHUNK_SIZE = 500;
    setIsUploading(true);
    setShowProgressPopup(true);
    setProgress(0);

    const totalChunks = Math.ceil(csvData.length / CHUNK_SIZE);
    setTotal(csvData.length);

    const chunks = [];
    for (let i = 0; i < totalChunks; i++) {
      chunks.push(csvData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }

    const source = axios.CancelToken.source();
    setCancelSource(source);

    try {
      let count = 1;
      const results = await Promise.all(
        chunks.map(async (chunk, index) => {
          const response = await axios.post(
            "https://b2b-saas-lead-mangement-main.onrender.com/api/upload-csv",
            {
              csvData: chunk,
              fieldMappings,
            },
            {
              cancelToken: source.token,
            }
          );
          setProgress((count / totalChunks) * 100);
          count += 1;
          return response.data;
        })
      );

      const leadResults: any[] = [];
      const companyResults: any[] = [];

      results.forEach(
        ({ leadResults: leadRes, companyResults: companyRes }) => {
          leadResults.push(...leadRes);
          companyResults.push(...companyRes);
        }
      );

      setLeadResults(leadResults);
      setCompanyResults(companyResults);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    } finally {
      setIsUploading(false);
      setProgress(100);
      setIsMinimized(false);
    }
  };

  const cancelUpload = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel the upload?"
    );
    if (userConfirmed) {
      if (cancelSource) {
        cancelSource.cancel("Upload cancelled by user");
      }
      setShowProgressPopup(false);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const closeModal = () => {
    setShowProgressPopup(false);
  };

  const minimizeModal = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <DataContext.Provider
      value={{
        startUpload,
        companyResults,
        leadResults,
      }}
    >
      {children}
      {/* Progress Popup */}
      {showProgressPopup && (
        <div
          className={`fixed  ${
            isMinimized
              ? " h-24 bottom-20 right-0 m-4"
              : "inset-0 flex items-center justify-center bg-black bg-opacity-50"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center gap-10 mb-4">
              <h2 className="text-xl font-bold">Uploading CSV</h2>
              <button onClick={minimizeModal} className="text-blue-500">
                {isMinimized ? <FaRegWindowMaximize /> : <FaMinimize />}
              </button>
            </div>
            {isMinimized ? (
              <div className="animate-bounce flex justify-center">
                <FaCloudUploadAlt size={40} color="blue" />
              </div>
            ) : (
              <>
                <p className="mb-4">
                  Uploaded {Math.round(progress)}% of {total} records
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  {isUploading ? (
                    <button
                      onClick={cancelUpload}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        closeModal();
                        router.push("/admin/upload-summary");
                      }}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      View Result
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
