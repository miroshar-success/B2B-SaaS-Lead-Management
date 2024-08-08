import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../context/Auth";
import { formatNumberWithCommas } from "../PlanCard";
import Loading from "../Loading";

type Props = {
  per: string;
  emailCredits: number;
  mobileCredits: number;
  type: string;
  actualPrice: number;
};

const Checkout: React.FC<Props> = ({
  emailCredits,
  mobileCredits,
  per,
  type,
  actualPrice,
}) => {
  // const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
  const stripePromise = loadStripe(
    "pk_test_CT0ybjoG9ebwjjsNrzxJO5W800eMiLG6ml"
  );
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axiosInstance
      .post("/stripe/create-payment-intent", {
        sub: { type, time: per === "Month" ? "Monthly" : "Yearly" },
      })
      .then((res) => setClientSecret(res.data.clientSecret));
    return () => {
      setClientSecret("");
    };
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    clientSecret,
    appearance,
  };
  console.log(emailCredits, emailCredits, mobileCredits);
  return (
    <div className="flex flex-col container mt-8 w-full">
      <div className="text-lg font-medium">
        {type}(${actualPrice})
      </div>
      <div>
        {formatNumberWithCommas(emailCredits)} Email Credits/{per}
      </div>
      {per === "Year" && (
        <div className="text-xs mb-2">
          ({formatNumberWithCommas(emailCredits / 12)}/month)
        </div>
      )}
      <div>
        {formatNumberWithCommas(mobileCredits)} Mobile Number Credits/{per}
      </div>

      {per === "Year" && (
        <div className="text-xs">
          ({formatNumberWithCommas(mobileCredits / 12)}/month)
        </div>
      )}
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Checkout;
