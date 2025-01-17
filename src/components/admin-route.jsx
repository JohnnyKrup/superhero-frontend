import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node,
};

export default AdminRoute;
