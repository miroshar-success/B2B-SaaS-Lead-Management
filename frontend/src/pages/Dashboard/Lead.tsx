import { useState, useEffect } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../context/Auth";
import Loading from "../../components/Loading";
import { Lead as LeadType } from "../../components/tables/People";

function Lead() {
  const { id } = useParams();
  const [lead, setLead] = useState<LeadType | null>(null);
  const [loading, setLoading] = useState(false);

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
  return (
    <div className="bg-gray-100 p-6 w-full  ">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex items-center mb-3 bg-white p-3 rounded-md w-full justify-between ">
            <div className="">
              <div className="flex items-center gap-3">
                <div className="">
                  {lead?.firstName?.value} {lead?.lastName?.value}
                </div>
                {lead?.linkedInUrl?.value && (
                  <Link to={`https://${lead?.linkedInUrl?.value}`}>
                    <FaLinkedinIn />
                  </Link>
                )}
              </div>
              <div className="">
                {lead?.jobTitle?.value} at{" "}
                <Link to="" className="text-primary uppercase font-medium">
                  {lead?.companyID?.name?.value}
                </Link>
              </div>
            </div>
            <button className="font-medium bg-primary rounded-md px-4 text-white py-2">
              Access Email & Phone Number
            </button>
          </div>
          <div className="p-3 bg-white rounded-md">
            <div className="text-lg font-semibold mb-4">Work History</div>
            <div className=" mb-4">No Work History</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Lead;
