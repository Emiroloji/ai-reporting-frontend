import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const initialized = useAuth((s) => s.initialized);
  const loading = useAuth((s) => s.loading);
  const user = useAuth((s) => s.user);
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  if (!initialized || loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Yükleniyor...</div>;
    }

  if (!hasToken && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;