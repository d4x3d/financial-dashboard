import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TransferLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-wf-red border-b-4 border-wf-yellow shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo-personal.svg"
              alt="Trusted"
              className="h-6"
            />
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Link */}
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-wf-red hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Accounts
          </Link>
        </div>

        {/* Outlet for nested routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default TransferLayout;
