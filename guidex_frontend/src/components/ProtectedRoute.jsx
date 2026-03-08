import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    // If user's role doesn't match the required role (e.g. agent trying to access admin),
    // redirect them to their home based on role
    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    } else {
        return <Navigate to="/agent" replace />;
    }
  }

  return children;
}
