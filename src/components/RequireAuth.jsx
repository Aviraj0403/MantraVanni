import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While auth status is being validated, don't redirect — show nothing (prevents flash)
  if (loading) return null;

  if (!user) {
    // User not logged in → redirect to signin and include the full location so user returns here after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
