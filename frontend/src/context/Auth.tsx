import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContextType, User } from "../type/user";

type ContainerProps = {
  children: React.ReactNode;
};

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://b2b-saas-lead-mangement-main.onrender.com/api",
  // timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});

// Define context and set defaults
const AuthContext = createContext<AuthContextType | null>(null);

axios.defaults.withCredentials = true;

const AuthProvider = (props: ContainerProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    const token = getCookie("token") || null;
    if (!token) {
      // Validate the token with the backend
      setLoading(true);
      axiosInstance
        .post("/users/validate", {
          withCredentials: true,
        })
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setLoading(false);
        });
    }
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const response = await axiosInstance.post("/users/login", credentials, {
        withCredentials: true,
      });
      const { user } = response.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
      return true; // Return true if login was successful
    } catch (error: any) {
      console.error("Failed to login", error);
      setUser(null);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Invalid email or password"
      );
      return false; // Return false if login failed
    }
  };

  const register = async (credentials2: {
    email: string;
    newPassword: string;
  }): Promise<boolean> => {
    try {
      console.log("Registration credentials:", credentials2); // Log credentials
      await axiosInstance.post("/users/register", {
        email: credentials2.email,
        password: credentials2.newPassword, // Ensure correct field name
      });

      // console.log('Registration response:', response.data); // Log response data
      return true;
    } catch (error) {
      console.error("Failed to register", error);
      return false;
    }
  };

  const accessEmails = async (leadIds: string[]) => {
    try {
      const response = await axiosInstance.post(`/users/leads/emails`, {
        leadIds,
      });

      // Return the accessed emails
      return response.data.emails;
    } catch (error: any) {
      console.error(
        "Error accessing emails:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const accessPhones = async (leadIds: string[]) => {
    try {
      const response = await axiosInstance.post(`/users/leads/phones`, {
        leadIds,
      });

      // Return the accessed phones
      return response.data.phones;
    } catch (error: any) {
      console.error(
        "Error accessing phones:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("done");
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        user,
        error,
        setUser,
        login,
        register,
        accessEmails,
        accessPhones,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
