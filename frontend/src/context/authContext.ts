// src/context/authContext.ts
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';


// Define User type
interface User {
  id: string;
  email: string;
  role: string;
}

// Define AuthContextProps type
interface AuthContextProps {
  user: User | null;
  // login: (email: string, password: string) => Promise<any>;
  // logout: () => Promise<void>;
  // loading: boolean;
}

// Create AuthContext with default value as undefined
export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/user');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
