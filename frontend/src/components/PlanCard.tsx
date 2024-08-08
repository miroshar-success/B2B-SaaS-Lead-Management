import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import Modal from "./Modal";
import Checkout from "./Checkout";

interface Props {
  planName: string;
  price: number;
  emailCredits: number;
  mobileCredits: number;
  actualPrice: number;
  per: string;
  features: string[];
  isCurrentPlan: boolean;
  onAddMore: () => void;
  onSelectPlan: () => void;
}

export function formatNumberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PlanCard: React.FC<Props> = ({
  planName,
  price,
  emailCredits,
  mobileCredits,
  actualPrice,
  features,
  per,
  isCurrentPlan,
  onAddMore,
  onSelectPlan,
}) => {
  console.log(onSelectPlan);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="border-t-8 border-primary rounded-md bg-white p-3">
      <div className="flex justify-center items-center h-60 flex-col">
        <div className="text-xl font-medium">{planName}</div>
        <div className="text-3xl font-medium">
          ${formatNumberWithCommas(price)}
        </div>

        {per === "Year" && (
          <div className="text-xs mb-2">
            (20% of {formatNumberWithCommas(actualPrice)})
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center border-y p-5 min-h-44">
        {/* <div className="flex items-center gap-1">
          ⚡ <span className="font-medium">{emailCredit}</span> Email Credit
          <CiCircleInfo />
        </div> */}
        {/* <div className="text-xs mb-3">({emailLimit}/month per account)</div> */}
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
        {isCurrentPlan ? (
          <div className="h-14"></div>
        ) : (
          <button
            className="border rounded-md p-2 w-full mt-4 font-medium"
            onClick={onAddMore}
          >
            Add More
          </button>
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        {isCurrentPlan ? (
          <button className="bg-gray-300 text-white rounded-md p-2 w-full my-4 font-medium">
            Current Plan
          </button>
        ) : (
          <>
            <button
              className="bg-primary text-white rounded-md p-2 w-full my-4 font-medium"
              onClick={() => setShowModal(true)}
            >
              Select Plan
            </button>
            <div className="text-primary font-medium">Try for free</div>
          </>
        )}
      </div>
      <div className="p-4 space-y-2 whitespace-normal">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <FaCheck className="text-primary" />
            <div>{feature}</div>
          </div>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Checkout
          emailCredits={emailCredits}
          mobileCredits={mobileCredits}
          per={per}
          type={planName}
          actualPrice={actualPrice}
        />
      </Modal>
    </div>
  );
};

export default PlanCard;
