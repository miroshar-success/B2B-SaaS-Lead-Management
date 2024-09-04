// src/pages/Companies.tsx
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaSort,
  FaFilter,
  FaLinkedinIn,
  FaPlus,
  FaLink,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import { axiosInstance } from "../../context/Auth";
import Filter from "../Filter";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Loading from "../Loading";
import { linkedInLink } from "../../utils/utils";

export interface Company {
  _id: string;
  linkedInUrl: { value: string };
  name: { value: string };
  keywords: { value: string };
  industry: { value: string };
  employees: { value: string };
  country: { value: string };
  website: { value: string };
  facebook: { value: string };
  twitter: { value: string };
  // Add other fields as needed
}

const filterConfigs = [
  { key: "name", label: "Name" },
  { key: "country", label: "Location" },
  {
    key: "employees",
    label: "Employees",
    customOptions: [
      "1-10",
      "11-20",
      "21-50",
      "51-100",
      "101-200",
      "201-500",
      "501-1000",
      "1001-2000",
      "2001-5000",
      "5001-10000",
      "100001+",
    ],
  },
  { key: "industry", label: "Industry" },
  // Add more filter fields here if needed
];

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [showFilter, setShowFilter] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<{
    [key: string]: {
      exclude: string | null;
      include: string | null;
      isKnown: boolean;
      isNotKnown: boolean;
    };
  }>({});

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, sortField, sortOrder, currentPage, pageSize, filters]);

  const fetchLeads = async () => {
    try {
      const response = await axiosInstance.get("/companies", {
        params: {
          search: searchTerm,
          sort: sortField,
          order: sortOrder,
          page: currentPage,
          size: pageSize,
          filter: JSON.stringify(filters),
        },
      });
      console.log(response.data);
      setCompanies(response.data.companies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
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

  return (
    <div className="flex  w-full gap-3">
      <div className={`${showFilter ? "w-1/5" : "w-0"}`}>
        <Filter
          clearFilters={clearFilter}
          filters={filters}
          handleFilterChange={handleFilterChange}
          setShowFilter={setShowFilter}
          showFilter={showFilter}
          filterConfigs={filterConfigs}
          url="companies"
        />
      </div>
      <div
        className={`bg-white rounded-md p-3 ${showFilter ? "w-4/5" : "w-full"}`}
      >
        <div className="flex justify-between items-center mb-4">
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
          {/* <div>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border p-2 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div> */}
        </div>
        <div className="overflow-auto h-[calc(100vh-300px)] w-full">
          <table className="min-w-full bg-white">
            <thead className="border sticky -top-1 z-20 h-full bg-white">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer sticky left-0 bg-white  "
                >
                  <div className="flex items-center gap-2 border-r-2 max-w-60">
                    Company <FaSort />
                  </div>
                </th>
                <th className="cursor-pointer p-2 w-32">
                  <div className="">Action</div>
                </th>
                <th
                  onClick={() => handleSort("employees")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2">
                    Employees <FaSort />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("industry")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2">
                    Industry <FaSort />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("keywords")}
                  className="cursor-pointer p-2"
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    Key Words <FaSort />
                  </div>
                </th>
                <th className="cursor-pointer p-2">
                  <div className="flex items-center whitespace-nowrap gap-2">
                    Company Location
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="border">
              {!companies ? (
                <div className="h-full w-full flex justify-center items-center p-5">
                  <Loading />
                </div>
              ) : companies.length === 0 ? (
                <div className="font-medium w-full flex  text-center py-10 px-2">
                  Start companies search by applying a filter
                </div>
              ) : (
                companies.map((company, index) => (
                  <tr key={index} className="border p-2">
                    <td className="font-medium max-w-60 overflow-hidden  capitalize p-2 border-r-2 flex items-start sticky left-0 bg-white">
                      <input type="checkbox" className="mr-2 mt-2" />
                      <img src="" className="w-10 h-10 rounded-md mr-2" />
                      <div>
                        <Link
                          className={`whitespace-nowrap  text-primary`}
                          to={`/company/${company._id}`}
                        >
                          {company.name.value}
                        </Link>
                        <div className="flex gap-2 items-center mt-2">
                          {company.website.value && (
                            <Link
                              to={`https://${company?.website?.value}`}
                              aria-label="LinkedIn"
                              className=""
                            >
                              <FaLink />
                            </Link>
                          )}
                          {company.linkedInUrl.value && (
                            <Link
                              to={linkedInLink(
                                company?.linkedInUrl?.value,
                                true
                              )}
                              aria-label="LinkedIn"
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <FaLinkedinIn />
                            </Link>
                          )}

                          {company.facebook.value && (
                            <Link
                              to={`https://${company?.facebook?.value}`}
                              aria-label="LinkedIn"
                              className="text-blue-700 hover:text-blue-900"
                            >
                              <FaFacebookF />
                            </Link>
                          )}

                          {company.twitter.value && (
                            <Link
                              to={`https://${company?.twitter?.value}`}
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
                      <button className="flex items-center gap-2 border p-2 rounded-md mx-2">
                        <FaPlus /> Save
                      </button>
                    </td>
                    <td>{company.employees.value}</td>
                    <td>{company.industry.value}</td>
                    <td>{company.keywords.value}</td>
                    <td>{company.country.value}</td>
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
    </div>
  );
};

export default Companies;
