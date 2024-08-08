import { axiosInstance } from "../context/Auth";

export interface Transaction {
  _id: string;
  amount: number;
  userId: string;
  status: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await axiosInstance.get<Transaction[]>(`/transactions`);
  return response.data;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await axiosInstance.get<Transaction[]>(`/transactions/all`);
  return response.data;
};
