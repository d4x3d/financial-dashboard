import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertCircle, Loader, DollarSign } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface TransferFormProps {
  transferType: string;
  onBack: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ transferType, onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    email: '',
    accountNumber: '',
    routingNumber: '',
    institutionName: '',
    amount: '',
    transferDate: 'today',
    memo: '',
    frequency: 'once',
  });

  // State for account data
  const [account, setAccount] = useState<any>({ id: '', name: 'Primary Account', accountNumber: '•••• 4567', balance: 0 });

  // Get current user from auth context (would need to import useAuth)
  // For now, using a placeholder - in a real app, you'd get the current user ID from auth context
  const currentUser = { userId: 'user-placeholder' }; // This should come from useAuth()
  
  // Get account data using Convex query
  const accountData = useQuery(api.accounts.getAccount, { userId: currentUser.userId });
  
  useEffect(() => {
    if (accountData) {
      setAccount(accountData);
    }
  }, [accountData]);

  // No predefined recipients

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    setError(null);

    if (!formData.recipientName) {
      setError('Please enter a recipient name');
      return false;
    }

    if (!formData.accountNumber) {
      setError('Please enter an account number');
      return false;
    }

    if (!formData.routingNumber) {
      setError('Please enter a routing number');
      return false;
    }

    if (formData.routingNumber.length !== 9) {
      setError('Routing number must be 9 digits');
      return false;
    }
    if (!formData.amount) {
      setError('Please enter an amount');
      return false;
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (amount > 10000) {
      setError('Transfers over $10,000 require additional verification');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    handleSubmitTransfer();
  };

  const handleBack = () => {
    onBack();
  };

  const createTransactionMutation = useMutation(api.transactions.createTransaction);

  const handleSubmitTransfer = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a transaction in the database
      const confirmationNumber = generateConfirmationNumber();
      
      if (!account._id) {
        throw new Error('Account not found');
      }

      await createTransactionMutation({
        fromAccountId: account._id,
        recipientName: formData.recipientName,
        recipientAccountNumber: formData.accountNumber,
        recipientRoutingNumber: formData.routingNumber,
        recipientBankName: formData.institutionName,
        amount: parseFloat(formData.amount),
        description: formData.memo || `Transfer to ${formData.recipientName}`
      });

      // Navigate to confirmation page
      navigate('/transfer/confirmation', {
        state: {
          transferData: formData,
          transferType,
          confirmationNumber
        }
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to process transfer. Please try again.');
      setIsLoading(false);
    }
  };

  const generateConfirmationNumber = () => {
    return 'TX' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
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

  // No need for account options anymore

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{getTransferTypeTitle()}</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* From Account - Display Only */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500">From</p>
          <p className="font-medium">Primary Account</p>
          <p className="text-sm text-gray-500">•••• {account.accountNumber?.slice(-4) || '4567'} - Balance: ${account.balance?.toFixed(2) || '0.00'}</p>
        </div>

        {/* Recipient Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              placeholder="Enter recipient name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter recipient email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
              />
            </div>

            <div>
              <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number
              </label>
              <input
                type="text"
                id="routingNumber"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                placeholder="9-digit routing number"
                maxLength={9}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
              />
            </div>
          </div>

          <div>
            <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
              Institution Name
            </label>
            <input
              type="text"
              id="institutionName"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleInputChange}
              placeholder="Enter institution name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            />
          </div>
        </div>

        {/* Amount and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
              />
            </div>
          </div>

          <div>
            <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700 mb-1">
              When
            </label>
            <select
              id="transferDate"
              name="transferDate"
              value={formData.transferDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="future">Future date</option>
            </select>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            >
              <option value="once">One time</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
              Memo (optional)
            </label>
            <input
              type="text"
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              placeholder="Add a note"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md mt-6">
          <p className="text-sm text-blue-700">
            By clicking "Transfer Money", you authorize us to process this transaction from your account.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center px-6 py-2 rounded-md bg-wf-red text-white hover:bg-red-800 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Transfer Money
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TransferForm;
