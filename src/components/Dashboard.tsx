import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Building,
  AlertTriangle,
  X,
  ArrowRight,
  CreditCard,
  History,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { LoadingSpinner } from "./ui/loading-spinner";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Function to get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 5) return "Good Night";
  if (hour >= 5 && hour < 9) return "Good Morning";
  if (hour >= 9 && hour < 12) return "Good Day";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Night";
  return "Good Night";
};

function Dashboard() {
  const [showAlert, setShowAlert] = useState(true);
  const { currentUser, account } = useAuth();
  const transactions = useQuery(
    api.transactions.getTransactionsByAccountId,
    account ? { accountId: account._id } : "skip"
  );

  const [loading, setLoading] = useState(true);
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
            <p className="text-slate-600">
              Loading your account information...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 max-w-4xl mx-auto">
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-amber-50 border-amber-200 text-amber-800 shadow-sm p-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                <div className="flex items-center mb-2 sm:mb-0">
                  <AlertTriangle className="h-4 w-4 text-amber-800 mr-2 flex-shrink-0" />
                  <AlertDescription className="text-sm">
                    New Login detected! Your last logon was on 2025-04-15
                    15:01:40.
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto mt-1 sm:mt-0 h-6 w-6 p-0 text-amber-800"
                  onClick={() => setShowAlert(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">
            {getTimeBasedGreeting()}, {currentUser?.fullName || "User"}
          </h1>
          <p className="text-gray-500 mt-1">
            Here's a summary of your accounts
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden border min-w-full h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-slate-700" />
                  <span className="font-medium">Available balance</span>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="text-3xl font-bold mb-2 text-left">
                    $
                    {account
                      ? Math.round(account.balance).toLocaleString("en-US")
                      : "0"}
                  </div>
                  <div className="text-sm text-gray-500 text-left">
                    Account ending in ***
                    {account?.accountNumber?.slice(-4) || "4487"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="overflow-hidden border min-w-full h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-slate-700" />
                  <span className="font-medium">Checking balance</span>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="text-3xl font-bold mb-2 text-left">
                    $
                    {account
                      ? Math.round(account.balance).toLocaleString("en-US")
                      : "0"}
                  </div>
                  <div className="text-sm text-gray-500 text-left">
                    Account ending in ***
                    {account?.accountNumber?.slice(-4) || "4487"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4 mb-8">
            {transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((transaction, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full flex items-center justify-center w-8 h-8 flex-shrink-0">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="font-medium text-sm truncate">
                          {transaction.description || "Transaction"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {new Date(
                            transaction._creationTime
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-green-600 font-medium text-right ml-2 flex-shrink-0">
                      <div className="text-sm">
                        +${Math.abs(transaction.amount).toLocaleString("en-US")}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-lg shadow-sm">
                <div className="flex flex-col items-center justify-center">
                  <History className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="font-medium">No recent transactions</p>
                  <p className="text-sm">
                    Your transaction history will appear here
                  </p>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => navigate("/transfer")}
            >
              <ArrowRight className="h-6 w-6 mb-2 text-slate-700" />
              <span className="text-sm">Transfer</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => navigate("/transactions")}
            >
              <History className="h-6 w-6 mb-2 text-slate-700" />
              <span className="text-sm">Transactions</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => navigate("/bills")}
            >
              <CreditCard className="h-6 w-6 mb-2 text-slate-700" />
              <span className="text-sm">Pay Bills</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => navigate("/profile")}
            >
              <Building className="h-6 w-6 mb-2 text-slate-700" />
              <span className="text-sm">Accounts</span>
            </Button>
          </div>
        </motion.div>

        {/* View All Transactions Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-4"
        >
          <Button
            variant="outline"
            className="w-full md:w-auto text-slate-700 hover:text-slate-900 hover:bg-gray-100"
            onClick={() => navigate("/transactions")}
          >
            View All Transactions
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
