'use client'
import React, {  createContext, useContext, useEffect, useState } from 'react';
import {  AuthContextType, User } from './authContext2';
import axios from 'axios';


type ContainerProps = {
  children: React.ReactNode;
}

// export const AuthContext = createContext<AuthContextType | null>(null);
const AuthContext = createContext<AuthContextType | null>(null);

axios.defaults.withCredentials = true;

const AuthProvider = (props: ContainerProps) => {
  
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    console.log(user);
    const login = async (credentials: { email: string; password: string }) => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/users/login', credentials, {
          withCredentials: true, // Ensure cookies are included
        });
        const userData: User = response.data; // Extract user data from response
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to login', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    const register = async (credentials: { email: string; newPassword: string }) => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/users/register', credentials);
        // const userData: User = response.data; // Extract user data from response
        // setUser(userData);
        // setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to register', error);
        // setUser(null);
        // setIsLoggedIn(false);
      }
    };
  // Provide the AuthContext value to its children
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn , user, setUser, login, register }}>
     { props.children } 
    </AuthContext.Provider>);
}

export default AuthProvider;


// Custom hook to consume the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// export function useAuth(){
//   const context = useContext(AuthContext);
//   return context
// }
// export const useAuth = useContext(AuthContext);