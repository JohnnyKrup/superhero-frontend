import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import Home from "./_index";
import SuperheroList from "./superheroes";
import ProtectedRoute from "../components/protected-route";
import AdminRoute from "../components/admin-route";
import Profile from "./profile";
import Login from "./auth.login";
import Register from "./auth.register";
import Dashboard from "./dashboard";
import Battle from "./battle";
import AdminDashboard from "./admin-dashboard";

// Define routes array with proper nesting
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "superheroes",
        children: [
          {
            index: true,
            element: <SuperheroList />,
          },
        ],
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "battle",
        element: (
          <ProtectedRoute>
            <Battle />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

// Create and export the router configuration
export const router = createBrowserRouter(routes);
