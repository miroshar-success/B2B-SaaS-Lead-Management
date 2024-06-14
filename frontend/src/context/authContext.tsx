'use client'
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { AuthContextType, User } from './authContext2';

type ContainerProps = {
  children: React.ReactNode;
};

// Define context and set defaults
const AuthContext = createContext<AuthContextType | null>(null);

axios.defaults.withCredentials = true;

const AuthProvider = (props: ContainerProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/users/login', credentials, {
        withCredentials: true,
      });
      const userData: User = response.data;
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to login', error);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const register = async (credentials2: { email: string; newPassword: string }) => {
    try {
      console.log('Registration credentials:', credentials2); // Log credentials

      const response = await axios.post('http://127.0.0.1:5000/api/users/register', {
        email: credentials2.email,
        password: credentials2.newPassword, // Ensure correct field name
      });

      console.log('Registration response:', response.data); // Log response data
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, login, register }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
