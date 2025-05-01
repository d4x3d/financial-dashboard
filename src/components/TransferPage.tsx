import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import DashboardLayout from "./DashboardLayout";
import LoadingOverlay from "./ui/loading-overlay";
import { motion } from "framer-motion";
import { Building, ArrowRight, AlertCircle, Search, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { db } from "../services/supabaseDb";
import { searchInstitutions, Institution } from "../utils/institutionData";

export default function TransferPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [formData, setFormData] = useState({
    routingNumber: "",
    accountNumber: "",
    bankName: "",
    bankId: 0,
    amount: "",
    pin: "",
  });

  // Institution search state
  const [institutionSearchQuery, setInstitutionSearchQuery] = useState("");
  const [institutionSearchResults, setInstitutionSearchResults] = useState<Institution[]>([]);
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const institutionSearchRef = useRef<HTMLDivElement>(null);

  // Get current user account from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // If this is a regular user account (not admin)
        if (!user.isAdmin && user.id) {
          // Get the account details
          const fetchAccount = async () => {
            try {
              const account = await db.getAccountById(user.id);
              if (account) {
                setCurrentAccount(account);
              }
            } catch (err) {
              console.error('Error fetching account:', err);
            }
          };
          fetchAccount();
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle institution search input change
  const handleInstitutionSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInstitutionSearchQuery(query);

    // Search for institutions matching the query
    const results = searchInstitutions(query);
    setInstitutionSearchResults(results);
    setShowInstitutionDropdown(true);
  };

  // Handle institution selection from dropdown
  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setInstitutionSearchQuery(institution.name);
    setFormData(prev => ({
      ...prev,
      bankName: institution.name,
      bankId: institution.id,
      // If the institution has a SWIFT code, use it as routing number
      routingNumber: institution.swift && institution.swift !== "N" ? institution.swift : prev.routingNumber
    }));
    setShowInstitutionDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (institutionSearchRef.current && !institutionSearchRef.current.contains(event.target as Node)) {
        setShowInstitutionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if we have a current account
      if (!currentAccount) {
        throw new Error('No account found. Please log in again.');
      }

      // Check if amount is valid
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      // Check if user has enough balance
      if (amount > currentAccount.balance) {
        throw new Error('Insufficient funds for this transfer.');
      }

      // Create transaction record
      const transaction = {
        id: Date.now().toString(),
        fromAccountId: currentAccount.id.toString(),
        toAccountId: formData.accountNumber,
        amount: amount,
        status: 'completed' as 'completed' | 'pending' | 'rejected', // Type assertion to match the expected type
        createdAt: new Date(),
        recipientName: 'External Recipient',
        recipientAccountNumber: formData.accountNumber,
        recipientRoutingNumber: formData.routingNumber,
        recipientBankName: formData.bankName,
        description: 'Transfer to external account'
      };

      // Update account balance
      const newBalance = currentAccount.balance - amount;
      await db.updateAccountBalance(currentAccount.id, newBalance);

      // Create transaction record in database
      await db.createTransaction(transaction);
      // Note: transaction history is now handled by the database service

      // Update local storage with new balance
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        user.balance = newBalance;
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      // Redirect to success page with transfer details
      const institutionNames: Record<string, string> = {
        region: "Region Financial",
        national: "National Financial",
        community: "Community Financial",
        trust: "Trust Financial",
      };

      navigate("/transfer-success", {
        state: {
          amount: formData.amount,
          bankName: institutionNames[formData.bankName] || formData.bankName,
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          confirmationNumber: `TX${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`
        }
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during the transfer');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay message="Processing your transfer..." />}

      <div className="p-4 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Transfer Money</h1>
            <p className="text-gray-500 mt-1">Send money to another account</p>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentAccount && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm font-medium">Available Balance</p>
              <p className="text-xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentAccount.balance)}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="routingNumber" className="text-sm font-medium flex items-center">
                Routing Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="routingNumber"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleChange}
                placeholder="Enter routing number"
                className="border-gray-300 focus:ring-slate-500 focus:border-slate-500 transition-all"
                required
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label htmlFor="accountNumber" className="text-sm font-medium flex items-center">
                Account Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className="border-gray-300 focus:ring-slate-500 focus:border-slate-500 transition-all"
                required
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              ref={institutionSearchRef}
            >
              <label htmlFor="bankName" className="text-sm font-medium flex items-center">
                Institution Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="institutionSearch"
                  value={institutionSearchQuery}
                  onChange={handleInstitutionSearchChange}
                  placeholder="Search for a financial institution..."
                  className="pl-10 border-gray-300 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  required
                />
                {selectedInstitution && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInstitution(null);
                        setInstitutionSearchQuery("");
                        setFormData(prev => ({ ...prev, bankName: "", bankId: 0 }));
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {showInstitutionDropdown && institutionSearchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                  <ul className="divide-y divide-gray-200">
                    {institutionSearchResults.map((institution) => (
                      <li
                        key={institution.id}
                        onClick={() => handleInstitutionSelect(institution)}
                        className="cursor-pointer hover:bg-gray-100 py-2 px-3 text-sm"
                      >
                        <div className="font-medium">{institution.name}</div>
                        {institution.swift && institution.swift !== "N" && (
                          <div className="text-xs text-gray-500">SWIFT: {institution.swift}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {institutionSearchResults.length === 0 && institutionSearchQuery.length > 0 && (
                <div className="text-sm text-gray-500 mt-1">
                  No institutions found. Try a different search term.
                </div>
              )}
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label htmlFor="amount" className="text-sm font-medium flex items-center">
                Amount To Transfer
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  type="number"
                  className="pl-8 border-gray-300 focus:ring-slate-500 focus:border-slate-500 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label htmlFor="pin" className="text-sm font-medium flex items-center">
                Transaction PIN
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                id="pin"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter PIN"
                type="password"
                maxLength={4}
                className="border-gray-300 focus:ring-slate-500 focus:border-slate-500 transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your 4-digit transaction PIN</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Button
                type="submit"
                className="w-full bg-slate-700 hover:bg-slate-800 transition-all duration-200 flex items-center justify-center"
              >
                Transfer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <motion.div
            className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <div className="flex items-start">
              <Building className="h-5 w-5 text-slate-700 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium text-sm">Transfer Information</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Transfers typically process within 1-3 business days depending on the receiving institution. There is no fee
                  for standard transfers.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
