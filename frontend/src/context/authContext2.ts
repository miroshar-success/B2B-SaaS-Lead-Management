import React, { createContext, SetStateAction } from 'react';
// Define the shape of the authentication context
export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<SetStateAction<User>>;
}

// Define the shape of the user object
export interface User {
  id: string;
  username: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);








