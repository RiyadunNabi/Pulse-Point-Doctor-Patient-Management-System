// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, requiredRole = null }) => {
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
