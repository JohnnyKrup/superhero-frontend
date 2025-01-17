import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axios";
import PropTypes from "prop-types";

export default function AuthForm({ defaultIsLogin = true }) {
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Determine endpoint based on whether it's login or register
    const endpoint = defaultIsLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      // For login, send only email and password
      // For register, send username, email, and password
      const loginData = defaultIsLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axiosInstance.post(endpoint, loginData);

      // If successful, response contains token and user data
      if (response.data && response.data.token && response.data.user) {
        // Store token and update auth context
        await login(response.data.token, response.data.user);
        // Redirect to dashboard after successful login
        navigate(`/dashboard`);
      } else {
        console.error("Missing token or user data in response");
      }
    } catch (error) {
      console.error(
        "Auth failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {defaultIsLogin ? "Sign in to your account" : "Create your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!defaultIsLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 border border-gray-300 focus:border-indigo-600"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 border border-gray-300 focus:border-indigo-600"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 border border-gray-300 focus:border-indigo-600"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {defaultIsLogin ? "Sign in" : "Register"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {defaultIsLogin
              ? "Not registered yet? "
              : "Already have an account? "}
            <a
              href={defaultIsLogin ? "/auth/register" : "/auth/login"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {defaultIsLogin ? "Create an account" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

AuthForm.propTypes = {
  defaultIsLogin: PropTypes.bool,
};
