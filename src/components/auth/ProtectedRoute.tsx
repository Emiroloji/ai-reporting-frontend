// src/components/auth/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const initialized = useAuth((s) => s.initialized);
  const loading = useAuth((s) => s.loading);
  const user = useAuth((s) => s.user);

  const hasToken =
    typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  if (!initialized || loading) {
    return <div className="p-6 text-center text-gray-600">Yükleniyor...</div>;
  }

  if (!hasToken && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;