'use client'
import React, {  createContext, useContext, useState } from 'react';
import {  AuthContextType, User } from './authContext2';


type ContainerProps = {
  children: React.ReactNode;
}

// export const AuthContext = createContext<AuthContextType | null>(null);
const AuthContext = createContext<AuthContextType | null>(null);


const AuthProvider = (props: ContainerProps) => {
  
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);


  // Provide the AuthContext value to its children
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn , user, setUser }}>
     { props.children } 
    </AuthContext.Provider>);
}

export default AuthProvider;


// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// export const useAuth = useContext(AuthContext);