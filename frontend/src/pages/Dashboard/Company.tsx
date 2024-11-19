import { FaSortUp } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaPhone } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { Lead } from "./Leads";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../context/Auth";
import { linkedInLink } from "../../utils/utils";
import FaviconImage from "../../components/FaviconImage";

interface Field {
  value: string;
  lastUpdated: Date;
}

interface ICompany {
  name: Field;
  linkedInUrl: Field;
  address: Field;
  website: Field;
  phone: Field;
  employees: Field;
  retailLocation: Field;
  industry: Field;
  keywords: Field;
  facebook: Field;
  twitter: Field;
  city: Field;
  state: Field;
  country: Field;
  seoDescription: Field;
  technologies: Field;
  annualRevenue: Field;
  totalFunding: Field;
  latestFunding: Field;
  latestFundingAmount: Field;
  lastRaisedAt: Field;
  createdAt?: Date; // Optional, as it will be added by Mongoose
  updatedAt?: Date; // Optional, as it will be added by Mongoose
}

function Company() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const { id } = useParams();
  const [company, setCompany] = useState<ICompany | null>(null);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      if (!id) return;
      const response = await axiosInstance.get(`/companies/${id}`);
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [company, currentPage, pageSize]);

  const fetchLeads = async () => {
    try {
      if (!company) return;
      const response = await axiosInstance.get(
        `/leads/linkedin/${company.linkedInUrl?.value}`,
        {
          params: {
            page: currentPage,
            size: pageSize,
          },
        }
      );
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between w-full container p-4 mx-auto">
        <div className="flex gap-5 items-center">
          <FaviconImage url={`https://${company?.website?.value}`} />
          <div className="flex flex-col gap-2">
            <div className="text-xl capitalize font-semibold mb-3">
              {company?.name?.value}
            </div>

            <div className="flex gap-3">
              {company?.facebook?.value && (
                <Link
                  to={company.facebook?.value}
                  aria-label="Facebook"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaFacebookF />
                </Link>
              )}
              {company?.linkedInUrl?.value && (
                <Link
                  to={linkedInLink(company.linkedInUrl?.value)}
                  aria-label="LinkedIn"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <FaLinkedinIn />
                </Link>
              )}
              {company?.twitter?.value && (
                <Link
                  to={company.twitter?.value}
                  aria-label="Twitter"
                  className="text-blue-400 hover:text-blue-600"
                >
                  <FaTwitter />
                </Link>
              )}
              <div className="text-blue-600 hover:text-blue-600">
                <FaPhone /> {company?.phone.value}
              </div>
            </div>
            <div className="text-gray-600 text-sm">
              {company?.industry?.value} • {company?.address.value} •{" "}
              {company?.employees?.value} employees
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 w-full">
        <div className="container mx-auto p-4 md:p-8 grid gap-5 md:grid-cols-3">
          <div className="bg-white p-4 rounded-md shadow-md col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-xl">Company Overview</div>
              {/* <button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
                <FaSortUp />
              </button> */}
            </div>
            <div className="text-gray-700 mb-4">
              {company?.seoDescription?.value}
            </div>
            <table className="w-full border-separate border-spacing-4">
              <thead>
                <tr>
                  <th className="text-left text-gray-600"></th>
                  <th className="text-left text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-gray-600">Keywords</td>
                  <td>
                    <div className="flex items-center flex-wrap gap-2">
                      {company?.keywords.value.split(",").map((word, index) => (
                        <div
                          key={index}
                          className="p-1 text-sm px-2 rounded-md bg-gray-200"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600">Phone</td>
                  <td>
                    <Link
                      to="#"
                      className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                      <FaPhone size={12} />
                      {company?.phone?.value}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600">Industry</td>
                  <td>
                    <div className="flex items-center flex-wrap gap-2">
                      {company?.industry.value.split(",").map((word, index) => (
                        <div
                          key={index}
                          className="p-1 text-sm px-2 rounded-md bg-gray-200"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600">Address</td>
                  <td>
                    {company?.address.value} {company?.city.value}{" "}
                    {company?.country.value}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600">Website</td>
                  <td>
                    {" "}
                    <Link
                      to={`https://${company?.website?.value}`}
                      aria-label="LinkedIn"
                      className=""
                    >
                      {company?.website.value}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-600">Employees</td>
                  <td>{company?.employees.value}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="hidden bg-white md:col-span-2 p-4 rounded-md shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-xl">New Prospects</div>
              <button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
                <FaSortUp />
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full  bg-white ">
                <thead className="border ">
                  <tr className="">
                    <th className=" p-2">
                      <div className="font-medium text-left opacity-70">
                        Name
                      </div>
                    </th>
                    <th className=" p-2 w-32">
                      <div className="font-medium text-left opacity-70">
                        Location
                      </div>
                    </th>

                    <th className=" p-2">
                      <div className="font-medium text-left opacity-70">
                        Department
                      </div>
                    </th>
                    <th className=" p-2">
                      <div className="font-medium text-left opacity-70">
                        Reason
                      </div>
                    </th>
                    <th className="text-right">
                      <div className="font-medium opacity-70">Actions</div>
                    </th>
                    {/* Add other headers as needed */}
                  </tr>
                </thead>
                <tbody className="border">
                  {leads.map((lead, index) => (
                    <tr key={index} className="border p-2">
                      <td className="font-medium capitalize p-2 border-r-2 flex">
                        <input type="checkbox" className="mr-2" />
                        <Link
                          className={`whitespace-nowrap text-blue-400`}
                          to={`/lead/${lead._id}`}
                        >
                          {lead.firstName?.value + " " + lead.lastName?.value}
                        </Link>
                      </td>
                      <td></td>
                      <td>{lead?.company?.value}</td>
                      <td>{lead.email?.value}</td>
                      <td>
                        <Link
                          to={lead.linkedInUrl?.value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </Link>
                      </td>
                    </tr>
                  ))}
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
      </div>
    </div>
  );
}

export default Company;
