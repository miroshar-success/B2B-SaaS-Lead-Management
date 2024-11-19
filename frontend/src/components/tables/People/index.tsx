// src/pages/People.tsx
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaSort,
  FaFilter,
  FaLinkedinIn,
  FaLink,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import Filter from "../../Filter";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination";
import Loading from "../../Loading";
import { Company } from "../Companies";
import AccessEmails from "./AccessEmails";
import { axiosInstance } from "../../../context/Auth";
import AccessPhones from "./AccessPhones";
import { linkedInLink } from "../../../utils/utils";
import Modal from "../../Modal";
import FaviconImage from "../../FaviconImage";

export interface Lead {
  _id: string;
  linkedInUrl: { value: string };
  firstName: { value: string };
  lastName: { value: string };
  email: { value: string };
  company: { value: string };
  jobTitle: { value: string };
  country: { value: string };
  companyID: Company;
  // Add other fields as needed
}

const filterConfigs = [
  { key: "firstName", label: "First Name" },
  { key: "jobTitle", label: "Job Title" },
  {
    key: "level",
    label: "Management Level",
    customOptions: [
      "Owner",
      "Founder",
      "C suite",
      "Partner",
      "Vp",
      "Head",
      "Director",
      "Manager",
      "Senior",
      "Entry",
      "Intern",
    ],
  },
  { key: "country", label: "Location" },
  { key: "company", label: "Company" },
  { key: "industry", label: "Industry" },
  { key: "gender", label: "Gender", customOptions: ["male", "female"] },
  { key: "department", label: "Department" },
  // Add more filter fields here if needed
];

const People: React.FC = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [showFilter, setShowFilter] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [filters, setFilters] = useState<{
    [key: string]: {
      exclude: string | null;
      include: string | null;
      isKnown: boolean;
      isNotKnown: boolean;
    };
  }>({});
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, sortField, sortOrder, currentPage, pageSize, filters]);

  const fetchLeads = async () => {
    try {
      const response = await axiosInstance.get("/leads", {
        params: {
          search: searchTerm,
          sort: sortField,
          order: sortOrder,
          page: currentPage,
          size: pageSize,
          filter: JSON.stringify(filters),
        },
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setPageSize(Number(e.target.value));
  //   setCurrentPage(1);
  // };

  const handleFilterChange = (
    key: string,
    type: string,
    value: string | boolean | null
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: {
        ...prevFilters[key],
        [type]: value,
      },
    }));

    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilters({});
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (leads) {
      if (checked) {
        // Select all leads
        setSelectedLeads(leads.map((lead) => lead._id));
      } else {
        // Deselect all leads
        setSelectedLeads([]);
      }
    }
  };

  const handleCheckboxChange = (leadId: string) => {
    setSelectedLeads((prevSelectedLeads) =>
      prevSelectedLeads.includes(leadId)
        ? prevSelectedLeads.filter((id) => id !== leadId)
        : [...prevSelectedLeads, leadId]
    );
  };

  // Function to convert JSON data to CSV
  const jsonToCsv = (data: any[]) => {
    const csvRows: string[] = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    // Loop over the data and create rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
  };

  // Function to trigger CSV download
  const downloadCsv = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  };

  // Function to export leads and download as CSV
  const exportLeadsAsCsv = async () => {
    try {
      setExporting(true);
      const response = await axiosInstance.post("/leads/export", {
        leadIds: selectedLeads,
      });
      console.log(response);
      if (response.data && response.data.leads) {
        const leads = response.data.leads;

        // Convert lead data to CSV format
        const csv = jsonToCsv(leads);

        // Trigger CSV download
        downloadCsv(csv, "exported-leads.csv");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error exporting leads:", error);
    } finally {
      setExporting(false);
    }
  };

  const exportBulkLeadsAsCsv = async () => {
    try {
      if (randomNumber <= 0) {
        return;
      }
      setExporting(true);
      const response = await axiosInstance.post("/leads/export-bulk", {
        count: randomNumber,
      });
      console.log(response);
      if (response.data && response.data.leads) {
        const leads = response.data.leads;

        // Convert lead data to CSV format
        const csv = jsonToCsv(leads);

        // Trigger CSV download
        downloadCsv(csv, "exported-leads.csv");
        setShowBulkModal(false);
      }
    } catch (error) {
      console.error("Error exporting leads:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-3 h-full w-full transition-all">
      <div className={`${showFilter ? "w-1/5" : "w-0"}`}>
        <Filter
          clearFilters={clearFilter}
          filters={filters}
          handleFilterChange={handleFilterChange}
          setShowFilter={setShowFilter}
          showFilter={showFilter}
          filterConfigs={filterConfigs}
          url="leads"
        />
      </div>
      <div
        className={`bg-white rounded-md p-3 ${showFilter ? "w-4/5" : "w-full"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-10 items-center">
              {showFilter ? (
                <div
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 border p-2 rounded-md cursor-pointer"
                >
                  <FaFilter
                    onClick={() => setShowFilter(!showFilter)}
                    size={12}
                    className="cursor-pointer"
                  />
                  <span>Hide Filter</span>
                </div>
              ) : (
                <div
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 border p-2 rounded-md cursor-pointer"
                >
                  <FaFilter size={12} className="cursor-pointer" />
                  <span>Show Filter</span>
                </div>
              )}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border p-2 rounded"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FaSearch className="absolute top-2 right-2 text-gray-500" />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBulkModal(true)}
                className="border-primary border text-primary px-4 py-2 rounded-md font-medium disabled:bg-gray-300 disabled:text-black"
              >
                Bulk
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-300 disabled:text-black"
                disabled={selectedLeads.length <= 0 || exporting}
              >
                {exporting ? "Exporting" : "Export"}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto h-[calc(100vh-300px)] ">
          <table className="min-w-full bg-white">
            <thead className="border sticky w-full -top-1 z-20 h-full bg-white">
              <tr>
                <th className="cursor-pointer sticky left-0 bg-white flex px-2 mt-2  ">
                  <input
                    type="checkbox"
                    className="mr-2 "
                    onChange={handleSelectAllChange}
                  />
                  <div
                    onClick={() => handleSort("firstName")}
                    className="flex items-center gap-2 "
                  >
                    Name <FaSort />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("title")}
                  className="cursor-pointer p-2 w-32"
                >
                  <div className="flex items-center gap-2">
                    Title <FaSort />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("company")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2">
                    Company <FaSort />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2">
                    Email <FaSort />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("phone")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2">
                    Phone <FaSort />
                  </div>
                </th>
                <th className="cursor-pointer p-2">
                  <div className="flex items-center gap-2 whitespace-nowrap ">
                    Contact Location
                  </div>
                </th>
                <th>Actions</th>
                {/* Add other headers as needed */}
              </tr>
            </thead>
            <tbody className="border">
              {!leads ? (
                <div className="h-full w-full flex justify-center items-center p-5">
                  <Loading />
                </div>
              ) : leads.length === 0 ? (
                <div className="font-medium w-full flex  text-center py-10 px-2">
                  Start your people search by applying a filter
                </div>
              ) : (
                leads.map((lead, index) => (
                  <tr key={index} className="border p-2">
                    <td className="font-medium capitalize p-2  flex items-start sticky left-0 bg-white">
                      <input
                        type="checkbox"
                        className="mr-2 mt-2"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => handleCheckboxChange(lead._id)}
                      />
                      <div>
                        <Link
                          className={`whitespace-nowrap text-blue-400`}
                          to={`/lead/${lead._id}`}
                        >
                          {lead.firstName.value + " " + lead.lastName.value}
                        </Link>
                        {lead?.linkedInUrl?.value && (
                          <Link
                            to={linkedInLink(lead?.linkedInUrl?.value)}
                            aria-label="LinkedIn"
                            className="text-blue-700 hover:text-blue-900"
                          >
                            <FaLinkedinIn />
                          </Link>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="mx-2 px-2 capitalize">
                        {lead.jobTitle.value}
                      </span>
                    </td>
                    <td className="font-medium max-w-60 overflow-hidden  capitalize px-4 mx-4 flex items-start left-0 bg-white">
                      <FaviconImage
                        url={`https://${lead?.companyID?.website?.value}`}
                      />
                      <div>
                        <Link
                          className={`whitespace-nowrap  text-primary`}
                          to={`/company/${lead?.companyID?._id}`}
                        >
                          {lead?.companyID?.name?.value}
                        </Link>
                        <div className="flex gap-2 items-center mt-2">
                          {lead?.companyID?.website?.value && (
                            <Link
                              to={`https://${lead?.companyID?.website?.value}`}
                              aria-label="LinkedIn"
                              className=""
                            >
                              <FaLink />
                            </Link>
                          )}
                          {lead?.companyID?.linkedInUrl?.value && (
                            <Link
                              to={linkedInLink(
                                lead?.companyID?.linkedInUrl?.value,
                                true
                              )}
                              aria-label="LinkedIn"
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <FaLinkedinIn />
                            </Link>
                          )}

                          {lead?.companyID?.facebook?.value && (
                            <Link
                              to={`https://${lead?.companyID?.facebook?.value}`}
                              aria-label="LinkedIn"
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <FaFacebookF />
                            </Link>
                          )}

                          {lead?.companyID?.twitter?.value && (
                            <Link
                              to={`https://${lead?.companyID?.twitter?.value}`}
                              aria-label="LinkedIn"
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <FaTwitter />
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <AccessEmails leadId={[lead._id]} />
                    </td>
                    <td>
                      <AccessPhones leadId={[lead._id]} />
                    </td>
                    <td>{lead.country.value}</td>
                    <td></td>
                    {/* Add other fields as needed */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className=" w-full">
          <div className="font-bold text-lg mb-4">Export as CSV</div>
          <div className="mb-4">
            Please note: Exporting new contacts to a CSV{" "}
            <span className="font-bold">
              costs 1 export credit per verified email.
            </span>
            Saved contacts with emails already available will not incur a credit
            cost.
          </div>
          <div className="mb-4">Your CSV export will be downloaded.</div>
          <div className="text-primary font-medium">
            Your made {selectedLeads.length} selections
          </div>
          <div className=" flex gap-5 items-center mt-6 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              onClick={exportLeadsAsCsv}
              className="bg-primary text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-300 disabled:text-black"
              disabled={selectedLeads.length <= 0 || exporting}
            >
              {exporting ? "Exporting" : "Export"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)}>
        <div className=" w-full">
          <div className="font-bold text-lg mb-4">Bulk Export</div>
          <div className="mb-4">
            Please note: Exporting new contacts to a CSV{" "}
            <span className="font-bold">
              costs 1 export credit per verified email.
            </span>{" "}
            Saved contacts with emails already available will not incur a credit
            cost.
          </div>
          <div className="mb-4">Your CSV export will be downloaded.</div>
          <div className="">Enter number of leads</div>
          <input
            className="border rounded-md border-primary"
            type="number"
            onChange={(e) => setRandomNumber(parseInt(e.target.value))}
          />
          <div className=" flex gap-5 items-center mt-6 justify-end">
            <button
              onClick={() => setShowBulkModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              onClick={exportBulkLeadsAsCsv}
              className="bg-primary text-white px-4 py-2 rounded-md font-medium disabled:bg-gray-300 disabled:text-black"
              disabled={randomNumber <= 0}
            >
              {exporting ? "Exporting" : "Export"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default People;
