import { Suspense, useState } from "react";
import { useData } from "../../context/DataContext";
import { calculateStatistics, getStatusClass } from "../../utils/data";

interface NestedObject {
  [key: string]: string | NestedObject | undefined;
}

const UploadSummary = () => {
  return (
    <div className="p-6 h-[calc(100vh-65px)] overflow-auto">
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(50);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const data = selectedTable === "lead" ? leadResults : companyResults;
  const statistics = calculateStatistics(data);

  // Filtered and Paginated Data

  const deepSearch = (obj: NestedObject, term: string): boolean => {
    for (const key in obj) {
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        if (deepSearch(value as NestedObject, term)) {
          return true;
        }
      } else if (
        typeof value === "string" &&
        value.toLowerCase().includes(term.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  };

  const filteredData = data.filter((row: NestedObject) =>
    deepSearch(row, searchTerm)
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4 ">
      <ToggleTable
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />
      <div className="mt-4 flex justify-center">
        <div className="p-4 w-full">
          <p>Success: {statistics.created}</p>
          <p>Errors: {statistics.errors}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <div>
          <label className="mr-2">Records per page:</label>
          <select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
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
            {currentData.map((row, index) => (
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
                    <td className={`px-4 py-2`}>
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

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
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

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  const maxPageButtons = 5; // Max number of page buttons to display
  const halfMaxButtons = Math.floor(maxPageButtons / 2);

  const startPage = Math.max(1, currentPage - halfMaxButtons);
  const endPage = Math.min(totalPages, currentPage + halfMaxButtons);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex list-none">
          {currentPage > 1 && (
            <>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  First
                </button>
              </li>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Previous
                </button>
              </li>
            </>
          )}
          {pageNumbers.map((number) => (
            <li key={number} className="mx-1">
              <button
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 rounded ${
                  number === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          {currentPage < totalPages && (
            <>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Next
                </button>
              </li>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Last
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default UploadSummary;
