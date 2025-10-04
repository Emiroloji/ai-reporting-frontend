import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CreditsPage from './pages/CreditsPage';
import FilesPage from './pages/FilesPage';
import FilePreviewPage from './pages/FilePreviewPage';
import FileMappingPage from './pages/FileMappingPage';
import ReportsPage from './pages/ReportsPage';
import ReportDetailPage from './pages/ReportDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const init = useAuth((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/files/:id/preview" element={<FilePreviewPage />} />
            <Route path="/files/:id/mapping" element={<FileMappingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:id" element={<ReportDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/credits" element={<CreditsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;