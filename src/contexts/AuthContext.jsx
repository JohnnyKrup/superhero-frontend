import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance, { TOKEN_KEY } from "../api/axios";

// Create the context with null as initial value
const AuthContext = createContext(null);

/**
 * Provider component that wraps your app and makes the auth object available to any
 * child component that calls useAuth().
 * @param {*} param0
 * @returns
 */
export const AuthProvider = ({ children }) => {
  // Auth-related state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to verify JWT token with backend
  const verifyToken = async (token) => {
    console.log("Verifying token:", token ? "Token exists" : "No token");

    try {
      const response = await axiosInstance.get("/api/auth/verify");
      console.log("Verify response:", response.data);

      if (response.data && response.data.user) {
        console.log(
          "Setting authenticated state with user:",
          response.data.user
        );
        // Update auth state with user data
        setUser(response.data.user);
        setIsAuthenticated(true);

        // Ensure axios instance has the token
        // Set token in axios headers for future requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  // Effect to check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Initializing auth state");
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }
        try {
          // Set token in axios headers
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          // Verify token with backend
          const isValid = await verifyToken(token);
          if (!isValid) {
            // Clean up invalid token
            console.log("Token invalid, cleaning up");
            localStorage.removeItem(TOKEN_KEY);
            delete axiosInstance.defaults.headers.common["Authorization"];
            setUser(null);
            setIsAuthenticated(false);
          } else {
            console.log("No token found");
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
          // Only remove token on specific error conditions
          if (error.response && error.response.status === 401) {
            // Clean up expired/invalid token
            console.log("Removing invalid token");
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            setIsAuthenticated(false);
          }
          console.error("Auth verification failed:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Empty dependency array, this runs only once on mount

  // Handle user login
  const login = async (token, userData) => {
    try {
      console.log(
        "Login called with token and user:",
        token ? "Token exists" : "No token",
        userData
      );

      // Extract roles from JWT payload
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const userWithRoles = {
        ...userData,
        roles: tokenPayload.roles || [],
      };

      // Store token and set up axios headers
      localStorage.setItem(TOKEN_KEY, token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Update auth state with user data
      setUser(userWithRoles);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to log in:", error);
      throw error;
    }
  };

  // Handle user logout
  const logout = () => {
    try {
      console.log("Logout called");
      // Remove token and clean up
      localStorage.removeItem(TOKEN_KEY);
      delete axiosInstance.defaults.headers.common["Authorization"];

      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  console.log("Current auth state:", { isAuthenticated, user, loading });

  // Provide auth context value to children
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Type checking for provider props
AuthProvider.propTypes = {
  children: PropTypes.node,
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
