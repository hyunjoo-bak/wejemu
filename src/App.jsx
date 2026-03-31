import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import MasterAccountPage from './pages/admin/MasterAccountPage';
import ApprovalPage from './pages/admin/ApprovalPage';
import PermissionsPage from './pages/admin/PermissionsPage';
import BusinessStatusPage from './pages/business/BusinessStatusPage';
import BizAdminPage from './pages/business/BizAdminPage';
import LoginLogPage from './pages/business/LoginLogPage';
import ErpMenuLogPage from './pages/logs/ErpMenuLogPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/business/status" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/business/status" replace />} />
        <Route path="admin/master" element={<MasterAccountPage />} />
        <Route path="admin/approval" element={<ApprovalPage />} />
        <Route path="admin/permissions" element={<PermissionsPage />} />
        <Route path="business/status" element={<BusinessStatusPage />} />
        <Route path="business/accounts" element={<BizAdminPage />} />
        <Route path="business/login-log" element={<LoginLogPage />} />
        <Route path="logs/erp-menu" element={<ErpMenuLogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
