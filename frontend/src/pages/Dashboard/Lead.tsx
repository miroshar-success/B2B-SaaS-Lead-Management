import { useState, useEffect } from "react";
import { FaFacebookF, FaLink, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { axiosInstance, useAuth } from "../../context/Auth";
import Loading from "../../components/Loading";
import { Lead as LeadType } from "../../components/tables/People";
import { linkedInLink } from "../../utils/utils";

function Lead() {
  const { id } = useParams();
  const [lead, setLead] = useState<LeadType | null>(null);
  const [loading, setLoading] = useState(false);

  const { accessEmails, accessPhones } = useAuth();
  const [loadingEP, setLoadingEP] = useState(false);
  const [error, setError] = useState("");
  const [emails, setEmails] = useState<string[] | null>(null);
  const [phones, setPhones] = useState<string[] | null>(null);

  const handleAccess = async () => {
    try {
      if (!lead?._id) return;
      setLoadingEP(true);
      setError("");
      const res = await accessEmails([lead?._id]);
      const resPhone = await accessPhones([lead?._id]);
      setEmails(res[0].email);
      setPhones(resPhone[0].phone);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoadingEP(false);
    }
  };

  useEffect(() => {
    fetchLesd();
  }, []);

  const fetchLesd = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const response = await axiosInstance.get(`/leads/${id}`);
      setLead(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!lead) return;

    // Define the CSV headers
    const headers = [
      "First Name",
      "Last Name",
      "Job Title",
      "Company Name",
      "Email",
      "Phone",
      "LinkedIn URL",
    ];

    // Define the CSV rows
    const rows = [
      [
        lead.firstName?.value,
        lead.lastName?.value,
        lead.jobTitle?.value,
        lead.companyID?.name?.value,
        emails ? emails.join(", ") : "N/A",
        phones ? phones.join(", ") : "N/A",
        lead.linkedInUrl?.value,
      ],
    ];

    // Convert the rows to CSV format
    const csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${lead.firstName?.value}_${lead.lastName?.value}_Lead.csv`;

    // Trigger the download
    link.click();
  };

  return (
    <div className="bg-gray-100 p-6 w-full  ">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex items-center mb-3 bg-white p-3 rounded-md w-full justify-between ">
            <div className="">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-xl font-medium capitalize">
                  {lead?.firstName?.value} {lead?.lastName?.value}
                </div>
                {lead?.linkedInUrl?.value && (
                  <Link to={linkedInLink(lead?.linkedInUrl?.value)}>
                    <FaLinkedinIn />
                  </Link>
                )}
              </div>
              <div className="capitalize font-medium">
                {lead?.jobTitle?.value}
              </div>
              <div className="">
                at{" "}
                <Link
                  to={`/company/${lead?.companyID._id}`}
                  className="text-blue-400 capitalize font-medium"
                >
                  {lead?.companyID?.name?.value}
                </Link>
              </div>
            </div>
            {loadingEP ? (
              <div
                className={`animate-spin rounded-full w-5 h-5 border-t-2 border-solid border-primary `}
              />
            ) : emails || phones ? (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 border p-2 rounded-md mx-2 whitespace-nowrap"
              >
                Export
              </button>
            ) : (
              <div>
                <button
                  onClick={handleAccess}
                  className="font-medium bg-primary rounded-md px-4 text-white py-2"
                >
                  Access Email & Phone Number
                </button>
                {error && <div className="text-xs text-red-500">{error}</div>}
              </div>
            )}
          </div>
          <div className="p-3 bg-white rounded-md">
            <div className="text-lg font-semibold mb-4">Work History</div>

            <div className="font-medium max-w-60 overflow-hidden  capitalize px-4 mx-4 flex items-start left-0 bg-white">
              <img src="" className="w-10 h-10 rounded-md mr-2" />
              <div>
                <Link
                  className={`whitespace-nowrap  text-primary`}
                  to={`/company/${lead?.companyID._id}`}
                >
                  {lead?.companyID.name.value}
                </Link>
                <div className="flex gap-2 items-center mt-2">
                  {lead?.companyID.website.value && (
                    <Link
                      to={`https://${lead?.companyID?.website?.value}`}
                      aria-label="LinkedIn"
                      className=""
                    >
                      <FaLink />
                    </Link>
                  )}
                  {lead?.companyID.linkedInUrl.value && (
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

                  {lead?.companyID?.facebook.value && (
                    <Link
                      to={`https://${lead?.companyID?.facebook?.value}`}
                      aria-label="LinkedIn"
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <FaFacebookF />
                    </Link>
                  )}

                  {lead?.companyID.twitter.value && (
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Lead;
