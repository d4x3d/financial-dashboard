import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Printer, Download, Loader } from 'lucide-react';

const TransferConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Get transfer data from location state
  const { transferData, transferType, confirmationNumber } = location.state || {};

  useEffect(() => {
    if (!transferData) {
      navigate('/transfer');
      return;
    }

    // Simulate processing - simplified to just a brief loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [transferData, navigate]);

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransferTypeTitle = () => {
    switch (transferType) {
      case 'between-accounts':
        return 'Transfer Between My Accounts';
      case 'to-someone':
        return 'Send Money to Someone';
      case 'to-another-bank':
        return 'Transfer to Another Institution';
      case 'wire-transfer':
        return 'Wire Transfer';
      default:
        return 'Transfer Money';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {isLoading ? (
        <div className="text-center py-8">
          <Loader className="h-12 w-12 text-wf-red animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">Processing your transfer</h2>
          <p className="text-gray-500">
            Please wait while we process your request...
          </p>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Transfer Successful</h2>
            <p className="text-gray-600 mt-2">Your money is on its way!</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{getTransferTypeTitle()}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-xl">${transferData.amount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Confirmation #</p>
                <p className="font-medium">{confirmationNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{formatTime()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">Primary Account</p>
                <p className="text-sm text-gray-500">•••• 4567</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{transferData.recipientName}</p>
                {transferData.email && (
                  <p className="text-sm text-gray-500">{transferData.email}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Institution Information</p>
                <p className="font-medium">{transferData.bankName || 'N/A'}</p>
                <p className="text-sm text-gray-500">Account: {transferData.accountNumber ? '••••' + transferData.accountNumber.slice(-4) : 'N/A'}</p>
                <p className="text-sm text-gray-500">Routing: {transferData.routingNumber ? '••••••' + transferData.routingNumber.slice(-3) : 'N/A'}</p>
              </div>

              {transferData.memo && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Memo</p>
                  <p className="font-medium">{transferData.memo}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <button className="flex items-center text-wf-red hover:underline">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
              <button className="flex items-center text-wf-red hover:underline">
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>

            <div className="flex space-x-4">
              <Link
                to="/transfer"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Make Another Transfer
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-wf-red text-white rounded-md hover:bg-red-800"
              >
                Done
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferConfirmation;
