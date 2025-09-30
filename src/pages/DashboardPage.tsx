import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          Çıkış
        </button>
      </div>
      <div className="mt-4">
        <p>Hoş geldin, {user?.firstName} {user?.lastName}</p>
      </div>
    </div>
  );
};

export default DashboardPage;