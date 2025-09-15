import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Check, X, Loader, AlertCircle } from 'lucide-react';

const PendingTransactions: React.FC = () => {
  const pendingTransactions = useQuery(api.admin.getPendingTransactions);
  const accounts = useQuery(api.admin.getAccounts);
  const approveTransaction = useMutation(api.admin.approveTransaction);
  const rejectTransaction = useMutation(api.admin.rejectTransaction);

  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get account details
  const getAccountDetails = (accountId: string) => {
    if (!accountId) return undefined;
    return accounts?.find(account => account._id === accountId);
  };

  // Handle approve transaction
  const handleApproveTransaction = async (transactionId: string) => {
    setIsLoading(true);
    setProcessingId(transactionId);
    setError(null);

    try {
      await approveTransaction({ transactionId });
    } catch (error) {
      console.error('Error approving transaction:', error);
      setError('Failed to approve transaction');
    } finally {
      setIsLoading(false);
      setProcessingId(null);
    }
  };

  // Handle reject transaction
  const handleRejectTransaction = async (transactionId: string) => {
    setIsLoading(true);
    setProcessingId(transactionId);
    setError(null);

    try {
      await rejectTransaction({ transactionId });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      setError('Failed to reject transaction');
    } finally {
      setIsLoading(false);
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Transactions</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {pendingTransactions?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No pending transactions to approve
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTransactions?.map((transaction) => {
            const fromAccount = getAccountDetails(transaction.fromAccountId);

            return (
              <div key={transaction._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Transfer {formatCurrency(transaction.amount)}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Created on {new Date(transaction._creationTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => transaction._id && handleApproveTransaction(transaction._id)}
                      disabled={isLoading && processingId === transaction._id}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      {isLoading && processingId === transaction._id ? (
                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => transaction._id && handleRejectTransaction(transaction._id)}
                      disabled={isLoading && processingId === transaction._id}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      {isLoading && processingId === transaction._id ? (
                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700">From</h3>
                    <p className="text-sm">
                      Account: •••• {fromAccount?.accountNumber ? fromAccount.accountNumber.slice(-4) : 'Unknown'}
                    </p>
                    <p className="text-sm">
                      Available Balance: {fromAccount ? formatCurrency(fromAccount.balance) : 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700">To</h3>
                    {transaction.toAccountId ? (
                      <p className="text-sm">
                        Internal Account: •••• {getAccountDetails(transaction.toAccountId)?.accountNumber ? getAccountDetails(transaction.toAccountId)?.accountNumber.slice(-4) : 'Unknown'}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm">Recipient: {transaction.recipientName}</p>
                        {transaction.recipientEmail && (
                          <p className="text-sm">Email: {transaction.recipientEmail}</p>
                        )}
                        {transaction.recipientAccountNumber && (
                          <p className="text-sm">
                            Account: •••• {transaction.recipientAccountNumber ? transaction.recipientAccountNumber.slice(-4) : '0000'}
                          </p>
                        )}
                        {transaction.recipientBankName && (
                          <p className="text-sm">Bank: {transaction.recipientBankName}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {transaction.memo && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-blue-700">Memo</h3>
                    <p className="text-sm text-blue-600">{transaction.memo}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingTransactions;
