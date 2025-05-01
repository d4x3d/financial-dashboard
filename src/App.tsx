import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import components directly
import SignInPage from './components/SignInPage';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import TransferPage from './components/TransferPage';
import TransferSuccessPage from './components/TransferSuccessPage';
import WellGoFarAuth from './components/admin/WellGoFarAuth';

// Import admin components
import {
  AdminLayout,
  UserManagement,
  AccountManagement,
  PendingTransactions,
  AdminLogin
} from './components/admin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />

          {/* User Routes - Protected except dashboard which is the main landing page */}
          <Route element={<ProtectedRoute requireAdmin={false} redirectPath="/" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/transfer-success" element={<TransferSuccessPage />} />

            {/* Redirect unused pages to dashboard */}
            <Route path="/bills" element={<Navigate to="/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
            <Route path="/accounts" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/wellgofar" element={<WellGoFarAuth />} />

          <Route element={<ProtectedRoute requireAdmin={true} redirectPath="/admin/login" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<UserManagement />} />
              <Route path="accounts" element={<AccountManagement />} />
              <Route path="transactions" element={<PendingTransactions />} />
            </Route>
          </Route>

          {/* Catch all route - redirect to dashboard if logged in, otherwise to login */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;