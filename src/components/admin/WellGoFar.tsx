import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { LoadingSpinner } from '../ui/loading-spinner';
import { db } from '../../services/supabaseDb';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle2, AlertTriangle, Plus, Trash2, DollarSign, LogOut, MinusCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function WellGoFar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Form states
  const [newAccount, setNewAccount] = useState({
    userid: '',
    password: '',
    displayName: '',
    accountType: 'Checking',
    accountNumber: '',
    balance: '0'
  });

  // State for add balance form
  const [addBalance, setAddBalance] = useState({
    accountId: '',
    amount: '',
    description: 'Balance added by admin',
    applyTax: true,
    taxRate: 2.0, // 2% default tax rate
    applyFee: true,
    feeRate: 0.5, // 0.5% default fee rate
    minFee: 1.50, // $1.50 minimum fee
    maxFee: 25.00, // $25.00 maximum fee
    isInvisible: false // Whether this transaction should be visible to the user
  });

  // State for deduct balance form
  const [deductBalance, setDeductBalance] = useState({
    accountId: '',
    amount: '',
    description: 'Balance deducted by admin',
    isInvisible: false // Whether this transaction should be visible to the user
  });

  // Load accounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      // Fetch accounts from Supabase
      const accountsData = await db.getAccounts();
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
      showNotification('error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle input changes for new account
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for add balance
  const handleBalanceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Handle different input types
    if (type === 'checkbox') {
      // For checkboxes, use the checked property
      setAddBalance(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number' && name.includes('Rate')) {
      // For rate inputs, ensure they're within reasonable limits
      const numValue = parseFloat(value);
      const limitedValue = Math.min(Math.max(numValue, 0), 100); // Limit between 0-100%

      setAddBalance(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      // For other inputs, use the value as is
      setAddBalance(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle input changes for deduct balance
  const handleDeductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Handle different input types
    if (type === 'checkbox') {
      // For checkboxes, use the checked property
      setDeductBalance(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // For other inputs, use the value as is
      setDeductBalance(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Create new account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a random account number if not provided
      const accountNumber = newAccount.accountNumber ||
        Math.floor(10000000 + Math.random() * 90000000).toString();

      // First, create the user if they don't exist
      const existingUser = await db.getUserByUserid(newAccount.userid);

      if (!existingUser) {
        console.log('User does not exist, creating user first...');

        // Create the user
        const newUserData = {
          userid: newAccount.userid,
          password: newAccount.password,
          fullName: newAccount.displayName || newAccount.userid,
          email: '',  // You might want to add an email field to your form
          isAdmin: false,
          createdAt: new Date()
        };

        const userId = await db.createUser(newUserData);

        if (!userId) {
          throw new Error('Failed to create user');
        }

        console.log('User created successfully with ID:', userId);
      } else {
        console.log('User already exists, proceeding with account creation');
      }

      // Now add the account to database
      const newAccountData: any = {
        userid: newAccount.userid,
        displayName: newAccount.displayName || newAccount.userid,
        accountType: newAccount.accountType,
        accountNumber: accountNumber,
        balance: parseFloat(newAccount.balance) || 0,
        createdAt: new Date()
      };

      // Only include password if it's provided (some Supabase schemas might not have this column)
      if (newAccount.password) {
        newAccountData.password = newAccount.password;
      }

      // Log the account data we're trying to create
      console.log('Creating account with data:', newAccountData);

      const accountId = await db.createAccount(newAccountData);

      if (!accountId) {
        throw new Error('Failed to create account');
      }

      // Refresh accounts list
      await loadAccounts();

      // Reset form
      setNewAccount({
        userid: '',
        password: '',
        displayName: '',
        accountType: 'Checking',
        accountNumber: '',
        balance: '0'
      });

      showNotification('success', 'Account created successfully');
    } catch (error) {
      console.error('Error creating account:', error);
      showNotification('error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Add balance to account
  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accountId = addBalance.accountId;
      const amount = parseFloat(addBalance.amount);
      const description = addBalance.description;
      const { isInvisible } = addBalance;

      console.log('WellGoFar: Adding balance with:', { accountId, amount, description });

      if (!accountId || isNaN(amount)) {
        throw new Error('Invalid account ID or amount');
      }

      // Get current account
      console.log('WellGoFar: Getting account by ID:', accountId);
      const account = await db.getAccountById(accountId);
      console.log('WellGoFar: Account data received:', account);

      if (!account) {
        throw new Error('Account not found');
      }

      // Calculate tax and fees based on admin settings
      const { applyTax, taxRate, applyFee, feeRate, minFee, maxFee } = addBalance;

      // Calculate tax if enabled
      const taxAmount = applyTax ? Math.round(amount * (taxRate / 100) * 100) / 100 : 0;

      // Calculate fee if enabled (with min/max limits)
      const feeAmount = applyFee ? Math.min(Math.max(amount * (feeRate / 100), minFee), maxFee) : 0;

      // Calculate net amount after deductions
      const netAmount = amount - taxAmount - feeAmount;

      console.log('WellGoFar: Calculating taxes and fees:', {
        amount,
        taxApplied: applyTax,
        taxRate: taxRate + '%',
        taxAmount,
        feeApplied: applyFee,
        feeRate: feeRate + '%',
        feeAmount,
        netAmount
      });

      // Update balance with net amount (after taxes and fees)
      const newBalance = account.balance + netAmount;
      console.log('WellGoFar: Updating balance from', account.balance, 'to', newBalance);
      await db.updateAccountBalance(accountId, newBalance);
      console.log('WellGoFar: Balance updated successfully');

      // 1. Add main deposit transaction
      const mainTransaction = {
        fromAccountId: null, // For deposits, the account is the recipient
        toAccountId: accountId,
        amount: Math.abs(netAmount), // Always store positive amount
        status: 'completed' as 'pending' | 'completed' | 'rejected',
        createdAt: new Date(),
        recipientName: account.displayName || account.userid,
        recipientAccountNumber: account.accountNumber,
        description: description || 'Balance added by admin',
        isPositive: true, // Deposits are always positive
        isVisible: !isInvisible // Set visibility based on admin choice
      };

      console.log('WellGoFar: Creating main transaction:', mainTransaction);
      const mainTransactionId = await db.createTransaction(mainTransaction);
      console.log('WellGoFar: Main transaction created with ID:', mainTransactionId);

      // 2. Add tax transaction if tax is applied
      if (applyTax && taxAmount > 0) {
        const taxTransaction = {
          fromAccountId: accountId,
          toAccountId: null,
          amount: taxAmount,
          status: 'completed' as 'pending' | 'completed' | 'rejected',
          createdAt: new Date(new Date().getTime() + 1000), // 1 second later
          recipientName: 'Internal Revenue Service',
          recipientBankName: 'Federal Reserve',
          description: `Tax deduction (${taxRate}%)`,
          recipientAccountNumber: 'IRS-TAX-DEDUCT',
          isPositive: false, // Tax is always negative
          isVisible: !isInvisible // Same visibility as main transaction
        };

        console.log('WellGoFar: Creating tax transaction:', taxTransaction);
        const taxTransactionId = await db.createTransaction(taxTransaction);
        console.log('WellGoFar: Tax transaction created with ID:', taxTransactionId);
      }

      // 3. Add fee transaction if fee is applied
      if (applyFee && feeAmount > 0) {
        const feeTransaction = {
          fromAccountId: accountId,
          toAccountId: null,
          amount: feeAmount,
          status: 'completed' as 'pending' | 'completed' | 'rejected',
          createdAt: new Date(new Date().getTime() + 2000), // 2 seconds later
          recipientName: 'Trusted',
          recipientBankName: 'Trusted',
          description: `Processing Fee (${feeRate}%)`,
          recipientAccountNumber: 'WF-PROC-FEE',
          isPositive: false, // Fee is always negative
          isVisible: !isInvisible // Same visibility as main transaction
        };

        console.log('WellGoFar: Creating fee transaction:', feeTransaction);
        const feeTransactionId = await db.createTransaction(feeTransaction);
        console.log('WellGoFar: Fee transaction created with ID:', feeTransactionId);
      }

      // Refresh accounts list
      await loadAccounts();
      console.log('WellGoFar: Accounts list refreshed');

      // Reset form but keep tax and fee settings
      setAddBalance({
        accountId: '',
        amount: '',
        description: 'Balance added by admin',
        // Preserve the tax and fee settings
        applyTax: addBalance.applyTax,
        taxRate: addBalance.taxRate,
        applyFee: addBalance.applyFee,
        feeRate: addBalance.feeRate,
        minFee: addBalance.minFee,
        maxFee: addBalance.maxFee,
        isInvisible: addBalance.isInvisible
      });

      // Show success message
      showNotification('success', `Added ${formatCurrency(netAmount)} to account (after ${formatCurrency(taxAmount)} tax and ${formatCurrency(feeAmount)} fee)${isInvisible ? ' (invisible transaction)' : ''}`);
    } catch (error) {
      console.error('WellGoFar: Error adding balance:', error);
      showNotification('error', 'Failed to add balance');
    } finally {
      setLoading(false);
    }
  };

  // Deduct balance from account
  const handleDeductBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accountId = deductBalance.accountId;
      const amount = parseFloat(deductBalance.amount);
      const description = deductBalance.description;
      const { isInvisible } = deductBalance;

      console.log('WellGoFar: Deducting balance with:', { accountId, amount, description });

      if (!accountId || isNaN(amount)) {
        throw new Error('Invalid account ID or amount');
      }

      // Get current account
      console.log('WellGoFar: Getting account by ID:', accountId);
      const account = await db.getAccountById(accountId);
      console.log('WellGoFar: Account data received:', account);

      if (!account) {
        throw new Error('Account not found');
      }

      // Make sure the account has enough balance
      if (account.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Update balance (deduct the amount)
      const newBalance = account.balance - amount;
      console.log('WellGoFar: Updating balance from', account.balance, 'to', newBalance);
      await db.updateAccountBalance(accountId, newBalance);
      console.log('WellGoFar: Balance updated successfully');

      // Create deduction transaction
      const deductTransaction = {
        fromAccountId: accountId, // For deductions, the account is the sender
        toAccountId: null,
        amount: amount, // Always store positive amount
        status: 'completed' as 'pending' | 'completed' | 'rejected',
        createdAt: new Date(),
        recipientName: 'Trusted Admin',
        recipientAccountNumber: 'ADMIN-DEDUCT',
        description: description || 'Balance deducted by admin',
        isPositive: false, // Deductions are always negative
        isVisible: !isInvisible // Set visibility based on admin choice
      };

      console.log('WellGoFar: Creating deduction transaction:', deductTransaction);
      const transactionId = await db.createTransaction(deductTransaction);
      console.log('WellGoFar: Deduction transaction created with ID:', transactionId);

      // Refresh accounts list
      await loadAccounts();
      console.log('WellGoFar: Accounts list refreshed');

      // Reset form but keep visibility setting
      setDeductBalance({
        accountId: '',
        amount: '',
        description: 'Balance deducted by admin',
        isInvisible: deductBalance.isInvisible
      });

      // Show success message
      showNotification('success', `Deducted ${formatCurrency(amount)} from account${isInvisible ? ' (invisible transaction)' : ''}`);
    } catch (error) {
      console.error('WellGoFar: Error deducting balance:', error);
      showNotification('error', `Failed to deduct balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setLoading(true);
      try {
        await db.deleteAccount(id);
        await loadAccounts();
        showNotification('success', 'Account deleted successfully');
      } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('error', 'Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    // Show full amount without decimal places
    return '$' + Math.round(amount).toLocaleString('en-US');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('wellgofar_admin');
      navigate('/wellgofar');
    } catch (error) {
      console.error('Error signing out:', error);
      showNotification('error', 'Failed to sign out');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trusted Admin Panel</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Notification */}
      {notification && (
        <Alert className={`mb-6 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Create Account Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label htmlFor="userid" className="block text-sm font-medium mb-1">
                  User ID
                </label>
                <Input
                  id="userid"
                  name="userid"
                  value={newAccount.userid}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newAccount.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={newAccount.displayName}
                  onChange={handleInputChange}
                  placeholder="Optional - defaults to User ID"
                />
              </div>
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium mb-1">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={newAccount.accountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">
                  Account Number (optional)
                </label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                />
              </div>
              <div>
                <label htmlFor="balance" className="block text-sm font-medium mb-1">
                  Initial Balance
                </label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={newAccount.balance}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <LoadingSpinner size={16} className="mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add Balance Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBalance} className="space-y-4">
              <div>
                <label htmlFor="add-accountId" className="block text-sm font-medium mb-1">
                  Select Account
                </label>
                <select
                  id="add-accountId"
                  name="accountId"
                  value={addBalance.accountId}
                  onChange={handleBalanceInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.userid} - {account.accountType} (****{account.accountNumber ? account.accountNumber.slice(-4) : '0000'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="add-amount" className="block text-sm font-medium mb-1">
                  Amount to Add
                </label>
                <Input
                  id="add-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={addBalance.amount}
                  onChange={handleBalanceInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="add-description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  id="add-description"
                  name="description"
                  value={addBalance.description}
                  onChange={handleBalanceInputChange}
                  required
                />
              </div>

              {/* Visibility Setting */}
              <div className="border rounded-md p-3 bg-gray-50 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="add-isInvisible"
                      name="isInvisible"
                      checked={addBalance.isInvisible}
                      onChange={handleBalanceInputChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="add-isInvisible" className="text-sm">
                      Invisible Transaction (Hidden from User)
                    </label>
                  </div>
                </div>
              </div>

              {/* Tax and Fee Settings */}
              <div className="border rounded-md p-3 bg-gray-50">
                <h3 className="font-medium mb-2 text-sm">Deductions</h3>

                {/* Tax Settings */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="applyTax"
                      name="applyTax"
                      checked={addBalance.applyTax}
                      onChange={handleBalanceInputChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="applyTax" className="text-sm">
                      Apply Tax
                    </label>
                  </div>

                  <div className="flex items-center">
                    <Input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      value={addBalance.taxRate}
                      onChange={handleBalanceInputChange}
                      disabled={!addBalance.applyTax}
                      className="w-16 h-8 text-sm"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                    <span className="ml-1 text-sm">%</span>
                  </div>
                </div>

                {/* Fee Settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="applyFee"
                      name="applyFee"
                      checked={addBalance.applyFee}
                      onChange={handleBalanceInputChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="applyFee" className="text-sm">
                      Apply Processing Fee
                    </label>
                  </div>

                  <div className="flex items-center">
                    <Input
                      type="number"
                      id="feeRate"
                      name="feeRate"
                      value={addBalance.feeRate}
                      onChange={handleBalanceInputChange}
                      disabled={!addBalance.applyFee}
                      className="w-16 h-8 text-sm"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                    <span className="ml-1 text-sm">%</span>
                  </div>
                </div>

                {/* Preview calculation if amount is entered */}
                {addBalance.amount && parseFloat(addBalance.amount) > 0 && (
                  <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                    <div className="flex justify-between">
                      <span>Gross Amount:</span>
                      <span>${Math.round(parseFloat(addBalance.amount)).toLocaleString('en-US')}</span>
                    </div>
                    {addBalance.applyTax && (
                      <div className="flex justify-between">
                        <span>Tax ({addBalance.taxRate}%):</span>
                        <span>-${Math.round(parseFloat(addBalance.amount) * (addBalance.taxRate / 100)).toLocaleString('en-US')}</span>
                      </div>
                    )}
                    {addBalance.applyFee && (
                      <div className="flex justify-between">
                        <span>Fee ({addBalance.feeRate}%):</span>
                        <span>-${Math.round(Math.min(Math.max(parseFloat(addBalance.amount) * (addBalance.feeRate / 100), addBalance.minFee), addBalance.maxFee)).toLocaleString('en-US')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium mt-1 border-t pt-1">
                      <span>Net Amount:</span>
                      <span>${Math.round(
                        parseFloat(addBalance.amount) -
                        (addBalance.applyTax ? parseFloat(addBalance.amount) * (addBalance.taxRate / 100) : 0) -
                        (addBalance.applyFee ? Math.min(Math.max(parseFloat(addBalance.amount) * (addBalance.feeRate / 100), addBalance.minFee), addBalance.maxFee) : 0)
                      ).toLocaleString('en-US')}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <LoadingSpinner size={16} className="mr-2" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-2" />
                )}
                Add Balance
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Deduct Balance Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Deduct Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeductBalance} className="space-y-4">
              <div>
                <label htmlFor="deduct-accountId" className="block text-sm font-medium mb-1">
                  Select Account
                </label>
                <select
                  id="deduct-accountId"
                  name="accountId"
                  value={deductBalance.accountId}
                  onChange={handleDeductInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.userid} - {account.accountType} (****{account.accountNumber ? account.accountNumber.slice(-4) : '0000'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="deduct-amount" className="block text-sm font-medium mb-1">
                  Amount to Deduct
                </label>
                <Input
                  id="deduct-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={deductBalance.amount}
                  onChange={handleDeductInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="deduct-description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  id="deduct-description"
                  name="description"
                  value={deductBalance.description}
                  onChange={handleDeductInputChange}
                  required
                />
              </div>

              {/* Visibility Setting */}
              <div className="border rounded-md p-3 bg-gray-50 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="deduct-isInvisible"
                      name="isInvisible"
                      checked={deductBalance.isInvisible}
                      onChange={handleDeductInputChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="deduct-isInvisible" className="text-sm">
                      Invisible Transaction (Hidden from User)
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <LoadingSpinner size={16} className="mr-2" />
                ) : (
                  <MinusCircle className="h-4 w-4 mr-2" />
                )}
                Deduct Balance
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">All Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !accounts.length ? (
            <div className="flex justify-center p-4">
              <LoadingSpinner size={24} />
            </div>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No accounts found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Display Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Account Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Account Number</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Balance</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm">{account.userid}</td>
                      <td className="px-4 py-3 text-sm">{account.displayName || account.userid}</td>
                      <td className="px-4 py-3 text-sm">{account.accountType}</td>
                      <td className="px-4 py-3 text-sm">****{account.accountNumber ? account.accountNumber.slice(-4) : '0000'}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(account.balance)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAccount(account.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
