import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TransferPage, TransferConfirmation, TransferLayout } from '../components/transfer';

const TransferRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<TransferLayout />}>
        <Route index element={<TransferPage />} />
        <Route path="confirmation" element={<TransferConfirmation />} />
        <Route path="*" element={<Navigate to="/transfer" replace />} />
      </Route>
    </Routes>
  );
};

export default TransferRoutes;
