import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../../context/Auth";
import { useState } from "react";

const AccessEmails: React.FC<{ leadId: string[] }> = ({ leadId }) => {
  const { accessEmails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emails, setEmails] = useState<string[] | null>(null);

  const handleAccessEmail = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await accessEmails(leadId);
      setEmails(res[0].email);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    <div
      className={`animate-spin rounded-full w-5 h-5 border-t-2 border-solid border-primary `}
    />
  ) : emails ? (
    <div>
      {emails.map((email) => (
        <div>{email}</div>
      ))}
    </div>
  ) : (
    <>
      <button
        onClick={handleAccessEmail}
        className="flex items-center gap-2 border p-2 rounded-md mx-2 whitespace-nowrap"
      >
        <FaEnvelope /> Access emails
      </button>
      {error && <div className="text-xs text-red-500">{error}</div>}
    </>
  );
};

export default AccessEmails;
