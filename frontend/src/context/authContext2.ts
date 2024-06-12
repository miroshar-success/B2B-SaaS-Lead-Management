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
}

// Define the shape of the user object
export interface User {
  email: string;
  role: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

type LoginFunction = (credentials: Credentials) => Promise<void>;
type RegisterFunction = (credentials: Credentials) => Promise<void>;

type Credentials = {
  email: string;
  password: string;
};









