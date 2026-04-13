import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Will update AuthContext later

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  // Check localStorage as fallback until AuthContext updated
  const storedToken = localStorage.getItem('token');
  const hasAccess = token || storedToken || user;

  if (!hasAccess) {
    // Redirect to login, pass intended path for returnUrl
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
