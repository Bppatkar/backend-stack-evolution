import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader.jsx';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    const returnUrl = window.location.pathname + window.location.search;
    return (
      <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} />
    );
  }

  return children;
}

export default ProtectedRoute;
