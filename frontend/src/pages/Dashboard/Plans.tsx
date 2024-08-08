import { useState } from "react";
import PlanCard from "../../components/PlanCard";

export const plans = [
  {
    planName: "Free",
    price: 0,
    emailCredit: "Unlimited",
    actualPrice: 0,
    emailCredits: 0,
    mobileCredits: 0,
    per: "Month",
    features: [],
    isCurrentPlan: true,
  },
  {
    planName: "Basic",
    price: 19,
    emailCredit: "Unlimited",
    actualPrice: 19,
    emailCredits: 2000,
    per: "Month",
    mobileCredits: 150,
    features: [],
    isCurrentPlan: false,
  },
  {
    planName: "Professional",
    price: 87,
    emailCredit: "Unlimited",
    actualPrice: 87,
    per: "Month",
    emailCredits: 10000,
    mobileCredits: 500,
    features: [],
    isCurrentPlan: false,
  },
  {
    planName: "Organisation",
    price: 197,
    emailCredit: "Unlimited",
    actualPrice: 197,
    per: "Month",
    emailCredits: 20000,
    mobileCredits: 1000,
    features: [],
    isCurrentPlan: false,
  },
];

export const annualPlans = [
  {
    planName: "Free",
    price: 0,
    emailCredit: "Unlimited",
    actualPrice: 0,
    emailCredits: 0,
    mobileCredits: 0,
    per: "Month",
    features: [],
    isCurrentPlan: true,
  },
  {
    planName: "Basic",
    price: 182.4,
    emailCredit: "Unlimited",
    actualPrice: 228,
    emailCredits: 24000,
    mobileCredits: 1800,
    per: "Year",
    features: [],
    isCurrentPlan: false,
  },
  {
    planName: "Professional",
    price: 835.2,
    emailCredit: "Unlimited",
    actualPrice: 1044,
    emailCredits: 120000,
    mobileCredits: 6000,
    per: "Year",
    features: [],
    isCurrentPlan: false,
  },
  {
    planName: "Organisation",
    price: 1892.4,
    emailCredit: "Unlimited",
    actualPrice: 2364,
    emailCredits: 240000,
    mobileCredits: 12000,
    per: "Year",
    features: [],
    isCurrentPlan: false,
  },
];

function Plans() {
  const [plan, setPlan] = useState("Annual");

  const handleAddMore = () => {
    // Logic to add more features or credits
  };

  const handleSelectPlan = () => {
    // Logic to select the plan
  };

  return (
    <div className="bg-gray-100 overflow-auto h-[calc(100vh-65px)]">
      <div className="flex flex-col justify-center items-center p-5">
        <div className="text-3xl font-medium">Upgrade Your Plan</div>
        <div className="text-xl font-medium">
          Pricing for one-person startups to Fortune 500 enterprises.
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-5">
        <div className="flex items-center border rounded-full p-1 font-medium text-gray-500">
          <button
            onClick={() => setPlan("Annual")}
            className={`${
              plan === "Annual" ? "bg-primary text-white" : ""
            } p-2 px-4 rounded-full relative `}
          >
            Annual Billing
            <div className="bg-yellow-500 p-1 text-xs rounded-md absolute -bottom-5 left-1/2 -translate-x-1/2">
              20% Off
            </div>
          </button>
          <button
            onClick={() => setPlan("Monthly")}
            className={`${
              plan === "Monthly" ? "bg-primary text-white" : ""
            } p-2 px-4 rounded-full `}
          >
            Monthly Billing
          </button>
        </div>
      </div>
      <div className="p-4 flex gap-2 overflow-auto whitespace-nowrap">
        {(plan === "Monthly" ? plans : annualPlans).map((plan, index) => (
          <PlanCard
            key={index}
            planName={plan.planName}
            price={plan.price}
            emailCredits={plan.emailCredits}
            mobileCredits={plan.mobileCredits}
            actualPrice={plan.actualPrice}
            per={plan.per}
            features={plan.features}
            isCurrentPlan={plan.isCurrentPlan}
            onAddMore={handleAddMore}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}

export default Plans;
