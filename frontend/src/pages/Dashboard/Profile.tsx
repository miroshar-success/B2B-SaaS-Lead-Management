import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ImSpinner9 } from "react-icons/im";
import { useAuth } from "../../context/Auth";
import { annualPlans, plans } from "./Plans";
import { Transaction, getTransactions } from "../../services/transaction";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handlefetchTransaction();
  }, []);
  const handlefetchTransaction = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setTransactions(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const currentPlans =
    user && user.subscription.time === "Monthly" ? plans : annualPlans;

  const currentPlan = currentPlans.find(
    (plan) => plan.planName === user?.subscription?.type
  );

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-2xl p-6 ">
        <h1 className=" text-2xl font-bold mb-6">Welcome</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-r bg-opacity-70 from-primary to-[#103256] text-white p-6 rounded-lg shadow-md mb-8 w-full ">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-bold">Current Credit Plan</h2>
            <div className="flex items-center gap-2">
              <div className="font-medium text-lg">
                {user?.subscription.type}
              </div>
              <Link className="bg-green-500 p-2 py-1 rounded-full" to="/plans">
                Upgrade
              </Link>
            </div>
          </div>
          <p className="text-3xl mt-4">{user?.emailCredit} Emails</p>
          <p className="text-3xl mt-4">{user?.phoneCredit} Phone</p>
        </div>

        <div className=" mb-6 border-b pb-6">
          <div className="text-lg font-medium mb-2">
            Subscription Details({user?.subscription.type})
          </div>
          <>
            <div className="flex justify-between">
              <span>Email Credit </span>
              <span>
                {currentPlan?.emailCredits} per {currentPlan?.per}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phone Credit</span>
              <span>
                {currentPlan?.mobileCredits} per {currentPlan?.per}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Renewal date</span>
              <span>7th August 2024</span>
            </div>
          </>
          {user?.subscription.type === "Free" && (
            <div className="flex items-center gap-3 mt-2">
              <div className="">No Subscription</div>
              <Link
                to="/plans"
                className="bg-primary  text-white px-2 py-0.5 rounded-full"
              >
                Subscribe
              </Link>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">Usage History</h2>
            <ImSpinner9
              onClick={handlefetchTransaction}
              className={loading ? `animate-spin mr-4` : "mr-4"}
              size={20}
            />
          </div>
          <div className="bg-secondary rounded-lg p-4 shadow-md">
            {transactions.length > 0 ? (
              <ul className="space-y-4">
                {transactions.map((transaction) => (
                  <li
                    key={transaction._id}
                    className="flex justify-between items-center border-b border-gray-600 pb-2"
                  >
                    <div>
                      <p className="font-semibold capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-gray-400">
                        {moment(transaction.createdAt).calendar()}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`${
                          transaction.type === "Deposit"
                            ? "text-green-500"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {transaction.type === "Deposit" && "+"}
                        {transaction.type === "Withdrawal" && "-"}
                        {transaction.amount}
                        {transaction.type !== "Withdrawal" &&
                          transaction.type !== "Deposit" &&
                          " unit"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No history found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
