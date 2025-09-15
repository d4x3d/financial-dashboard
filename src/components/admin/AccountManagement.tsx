import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { DollarSign, Edit, Loader, Check, X } from 'lucide-react';

const AccountManagement: React.FC = () => {
  const accounts = useQuery(api.admin.getAccounts);
  const users = useQuery(api.admin.getUsers);
  const updateAccountBalance = useMutation(api.admin.updateAccountBalance);

  const [isEditingBalance, setIsEditingBalance] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user name by ID
  const getUserName = (userId?: string): string => {
    if (!userId) return 'Unknown User';
    const user = users?.find(user => user.userId === userId);
    return user && user.fullName ? user.fullName : 'Unknown User';
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle balance edit
  const handleEditBalance = (account: any) => {
    setIsEditingBalance(account._id || null);
    setNewBalance(account.balance.toString());
  };

  // Handle balance update
  const handleUpdateBalance = async (accountId: string) => {
    if (!newBalance || isNaN(Number(newBalance))) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateAccountBalance({ accountId, balance: Number(newBalance) });
      setIsEditingBalance(null);
    } catch (error) {
      console.error('Error updating balance:', error);
      setError('Failed to update balance');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditingBalance(null);
    setError(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
          <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts?.map((account) => (
              <tr key={account._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        •••• {account.accountNumber.slice(-4)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Routing: •••• {account.routingNumber ? account.routingNumber.slice(-4) : '0000'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getUserName(account.userId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {account.accountType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEditingBalance === account._id ? (
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="text"
                          value={newBalance}
                          onChange={(e) => setNewBalance(e.target.value)}
                          className="pl-8 pr-12 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
                        />
                      </div>
                      <div className="ml-2 flex space-x-1">
                        <button
                          onClick={() => account._id && handleUpdateBalance(account._id)}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-900"
                        >
                          {isLoading ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(account.balance)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isEditingBalance !== account._id && (
                    <button
                      onClick={() => handleEditBalance(account)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!accounts?.length && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No accounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;
