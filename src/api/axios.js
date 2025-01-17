import axios from "axios";
import API_BASE_URL from "../config/api";

const TOKEN_KEY = "token";

/**
 * One consistent way to make API calls
 * Base URL is defined once
 * Default headers are set in one place
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Initialize headers from localStorage on startup
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Add a request interceptor to include JWT token with every request
// This runs BEFORE every request leaves your application
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
// This runs AFTER receiving any response or error from the server
axiosInstance.interceptors.response.use(
  (response) => response,
  // All authentication errors are handled the same way
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and force logout on 401 responses
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default axiosInstance;
