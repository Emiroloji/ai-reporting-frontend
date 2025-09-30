// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const init = useAuth((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <Router>
      <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;