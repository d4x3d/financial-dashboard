import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, AlertTriangle, Building, Download, Filter, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const { currentUser, account } = useAuth();
  const transactions = useQuery(api.transactions.getTransactionsByAccountId, account ? { accountId: account._id } : 'skip');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'debit'
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center">
            <LoadingSpinner size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-600">Loading transaction history...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter and search transactions
  const filteredTransactions = transactions?.filter(transaction => {
    // Apply search filter
    const searchMatch = searchTerm === '' ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.recipientName && transaction.recipientName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Apply type filter
    let typeMatch = true;
    if (filterType !== 'all') {
      const isDeposit = transaction.toAccountId === account?._id ||
                       transaction.recipientAccountNumber === account?.accountNumber;

      if (filterType === 'credit' && !isDeposit) typeMatch = false;
      if (filterType === 'debit' && isDeposit) typeMatch = false;
    }

    return searchMatch && typeMatch;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    // Show full amount without decimal places
    return '
 + amount.toLocaleString('en-US');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 h-9 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'credit' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none border-l-0 border-r-0"
                onClick={() => setFilterType('credit')}
              >
                Deposits
              </Button>
              <Button
                variant={filterType === 'debit' ? 'default' : 'outline'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setFilterType('debit')}
              >
                Withdrawals
              </Button>
            </div>
          </div>
        </motion.div>

        {filteredTransactions && filteredTransactions.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="flex flex-col items-center justify-center">

              <h3 className="text-lg font-medium text-gray-700 mb-1">No transactions found</h3>
              <p className="text-gray-500 max-w-md">
                {searchTerm || filterType !== 'all'
                  ? "Try adjusting your search or filter criteria"
                  : "Your transaction history will appear here once you have activity"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions?.map((transaction, index) => {
              // Simply use the isPositive flag if available
              let isDeposit = transaction.isPositive !== undefined ? transaction.isPositive : true;

              return (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
                    <CardContent className="p-0">
                      <div className="flex items-center p-3 border-b bg-gray-50">
                        <div className={`${
                          transaction.description?.includes('Tax') ? 'bg-red-100' :
                          transaction.description?.includes('Fee') ? 'bg-orange-100' :
                          isDeposit ? 'bg-green-100' : 'bg-blue-100'
                        } p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8`}>
                          {transaction.description?.includes('Tax') ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : transaction.description?.includes('Fee') ? (
                            <Building className="h-4 w-4 text-orange-600" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-slate-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="font-medium text-sm truncate">{transaction.description || 'Transaction'}</div>
                          <div className="text-xs text-gray-500">
                            {transaction._creationTime ? formatDate(transaction._creationTime) : 'Unknown date'}
                          </div>
                        </div>
                        <div className={`${isDeposit ? 'text-green-600' : 'text-red-600'} font-medium text-right`}>
                          {isDeposit ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="grid grid-cols-[auto_1fr] border-b md:border-r">
                          <div className="p-2 font-medium bg-gray-50 text-xs">Transaction ID</div>
                          <div className="p-2 text-right text-xs truncate">{transaction._id}</div>
                        </div>

                        <div className="grid grid-cols-[auto_1fr] border-b">
                          <div className="p-2 font-medium bg-gray-50 text-xs">Status</div>
                          <div className="p-2 text-right text-xs">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {transaction.status || 'Completed'}
                            </span>
                          </div>
                        </div>

                        {transaction.fromAccountId && (
                          <div className="grid grid-cols-[auto_1fr] border-b md:border-r">
                            <div className="p-2 font-medium bg-gray-50 text-xs">From</div>
                            <div className="p-2 text-right text-xs">{transaction.fromAccountId === account?._id ? 'Your Account' : (transaction.senderName || 'External Account')}</div>
                          </div>
                        )}

                        {transaction.toAccountId && (
                          <div className="grid grid-cols-[auto_1fr] border-b">
                            <div className="p-2 font-medium bg-gray-50 text-xs">To</div>
                            <div className="p-2 text-right text-xs">{transaction.toAccountId === account?._id ? 'Your Account' : (transaction.recipientName || 'External Account')}</div>
                          </div>
                        )}

                        {transaction.recipientAccountNumber && (
                          <div className="grid grid-cols-[auto_1fr] border-b md:border-r">
                            <div className="p-2 font-medium bg-gray-50 text-xs">Account Number</div>
                            <div className="p-2 text-right text-xs">****{transaction.recipientAccountNumber.slice(-4)}</div>
                          </div>
                        )}

                        {transaction.recipientBankName && (
                          <div className="grid grid-cols-[auto_1fr] border-b">
                            <div className="p-2 font-medium bg-gray-50 text-xs">Bank</div>
                            <div className="p-2 text-right text-xs">{transaction.recipientBankName}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Export Button */}
        {filteredTransactions && filteredTransactions.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Transactions
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
