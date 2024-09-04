import React, { SetStateAction } from "react";
// Define the shape of the authentication context
export type AuthContextType = {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  user: User | null;
  error: string;
  setUser: React.Dispatch<SetStateAction<User | null>>;
  login: LoginFunction;
  register: RegisterFunction;
  accessEmails: (
    value: string[]
  ) => Promise<{ leadId: string; email: string[] }[]>;
  accessPhones: (
    value: string[]
  ) => Promise<{ leadId: string; phone: string[] }[]>;
  logout: () => void;
};

// Define the shape of the user object
export interface User {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  plan: string | null;
  subscription: { type: string; time: String };
  emailCredit: number;
  phoneCredit: number;
}

type LoginFunction = (credentials: Credentials) => Promise<boolean>;
type RegisterFunction = (credentials: Credentials2) => Promise<boolean>;

type Credentials = {
  email: string;
  password: string;
};
type Credentials2 = {
  email: string;
  newPassword: string;
};
