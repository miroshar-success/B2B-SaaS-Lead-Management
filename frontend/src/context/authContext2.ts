'use client'
import React, { createContext, SetStateAction } from 'react';
// Define the shape of the authentication context
export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<SetStateAction<User|null>>;
  login: LoginFunction;
  register: RegisterFunction;
  isActive: string;
  setIsActive: React.Dispatch<SetStateAction<string>>;
}

// Define the shape of the user object
export interface User {
  email: string;
  role: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

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









