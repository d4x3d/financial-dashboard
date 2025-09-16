import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Download, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

// Define the transaction type for better type safety
type Transaction = Doc<"transactions">;

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const { account } = useAuth();

  // The useQuery hook is fine, but we can be more explicit about the skip condition
  const transactions = useQuery(
    api.transactions.getTransactionsByAccountId,
    account ? { accountId: account._id } : "skip"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'credit', 'debit'
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Improved filtering logic with better type safety
  const filteredTransactions = transactions?.filter(
    (transaction: Transaction) => {
      if (!transaction) return false;

      const searchMatch =
        searchTerm === "" ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.recipientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (filterType === "all") return searchMatch;

      // Use the isPositive flag for more reliable credit/debit filtering
      const isCredit = transaction.isPositive === true;
      const typeMatch =
        (filterType === "credit" && isCredit) ||
        (filterType === "debit" && !isCredit);

      return searchMatch && typeMatch;
    }
  );

  // Robust currency formatting
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Robust date formatting
  const formatDate = (dateValue: number | string) => {
    if (!dateValue) return "Unknown date";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <DashboardLayout>
      <div className="p-4 max-w-5xl mx-auto">
        {/* Header and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-8 h-9 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "credit" ? "default" : "outline"}
                size="sm"
                className="rounded-none border-l-0 border-r-0"
                onClick={() => setFilterType("credit")}
              >
                Deposits
              </Button>
              <Button
                variant={filterType === "debit" ? "default" : "outline"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setFilterType("debit")}
              >
                Withdrawals
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Transaction List */}
        {filteredTransactions && filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => {
              return (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.05, 1),
                  }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
                    <CardContent className="p-0">
                      <div className="flex items-center p-3 border-b bg-gray-50">
                        {/* Icon */}
                        <div className="p-2 rounded-full mr-3 w-8 h-8 flex items-center justify-center bg-green-100">
                          <CreditCard className="h-4 w-4 text-slate-700" />
                        </div>
                        {/* Description and Date */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {transaction.description || "Transaction"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(transaction._creationTime)}
                          </div>
                        </div>
                        {/* Amount */}
                        <div className="font-medium text-right text-green-600">
                          +{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>

                      {/* Simplified and more robust grid layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 text-xs">
                        <div className="p-2 flex justify-between border-b sm:border-r">
                          <strong>Transaction ID:</strong>{" "}
                          <span className="truncate">{transaction._id}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b">
                          <strong>Status:</strong>{" "}
                          <span className="capitalize">
                            {transaction.status || "Completed"}
                          </span>
                        </div>
                        {transaction.fromAccountId && (
                          <div className="p-2 flex justify-between border-b sm:border-b-0 sm:border-r">
                            <strong>From:</strong>{" "}
                            <span>
                              {transaction.fromAccountId === account?._id
                                ? "Your Account"
                                : transaction.recipientName || "External"}
                            </span>
                          </div>
                        )}
                        {transaction.toAccountId && (
                          <div className="p-2 flex justify-between">
                            <strong>To:</strong>{" "}
                            <span>
                              {transaction.toAccountId === account?._id
                                ? "Your Account"
                                : transaction.recipientName || "External"}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No transactions found
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Your transaction history will appear here once you have activity"}
            </p>
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
