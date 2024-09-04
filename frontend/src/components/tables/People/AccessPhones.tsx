import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../../context/Auth";
import { useState } from "react";

const AccessPhones: React.FC<{ leadId: string[] }> = ({ leadId }) => {
  const { accessPhones } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phones, setPhones] = useState<string[] | null>(null);

  const handleAccessPhones = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await accessPhones(leadId);
      setPhones(res[0].phone);
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
  ) : phones ? (
    <div>
      {phones.map((phones) => (
        <div>{phones}</div>
      ))}
    </div>
  ) : (
    <>
      <button
        onClick={handleAccessPhones}
        className="flex items-center gap-2 border p-2 rounded-md mx-2 whitespace-nowrap"
      >
        <FaEnvelope /> Access mobiles
      </button>
      {error && <div className="text-xs text-red-500">{error}</div>}
    </>
  );
};

export default AccessPhones;
