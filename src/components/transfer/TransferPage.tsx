import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import TransferForm from './TransferForm';

const TransferPage = () => {
  const [transferType, setTransferType] = useState<string | null>(null);

  const transferOptions = [
    {
      id: 'to-someone',
      title: 'To someone else',
      description: 'Send money to friends, family, or others',
      icon: '👤'
    },
    {
      id: 'to-another-bank',
      title: 'To another bank',
      description: 'Transfer to accounts at other financial institutions',
      icon: '🏦'
    },
    {
      id: 'wire-transfer',
      title: 'Wire transfer',
      description: 'Send a domestic or international wire transfer',
      icon: '🌐'
    }
  ];

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600 mt-2">Select a transfer type to get started</p>
      </div>

        {transferType ? (
          <TransferForm transferType={transferType} onBack={() => setTransferType(null)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transferOptions.map((option) => (
              <div
                key={option.id}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setTransferType(option.id)}
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4">{option.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{option.title}</h3>
                    <p className="text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-wf-red flex items-center hover:underline">
                    Select <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
};

export default TransferPage;
