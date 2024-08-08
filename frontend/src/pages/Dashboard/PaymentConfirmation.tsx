import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from "../../context/Auth";

const PaymentConfirmation = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Parse query parameters from the URL to get payment details
    const query = new URLSearchParams(location.search);
    const paymentIntentId = query.get("payment_intent");

    // Fetch payment details from your server
    const fetchPaymentDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/stripe/payment/${paymentIntentId}`
        );
        const data = response.data;
        setPaymentDetails(data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    if (paymentIntentId) {
      fetchPaymentDetails();
    }
  }, [location.search]);

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <div className="flex justify-center mb-4">
          <FaCheck className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          Payment Successful!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Thank you for your payment. Your transaction was successful.
        </p>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Payment Details:</h3>
          <p>
            <strong>Amount:</strong> ${(paymentDetails.amount / 100).toFixed(2)}
          </p>
          <p>
            <strong>Currency:</strong> {paymentDetails.currency.toUpperCase()}
          </p>
          <p>
            <strong>Transaction ID:</strong> {paymentDetails.id}
          </p>
          <p>
            <strong>Status:</strong> {paymentDetails.status}
          </p>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/profile"
            className="bg-primary text-white py-2 px-4 rounded-full hover:bg-secondary"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
