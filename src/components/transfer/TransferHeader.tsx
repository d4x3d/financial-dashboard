import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';

const TransferHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-wf-red border-b-4 border-wf-yellow shadow-md">
      <nav className="max-w-7xl mx-auto">
        {/* Top Nav */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo-personal.svg"
              alt="Trusted"
              className="h-6"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-200 text-sm">ATMs/Locations</a>
            <a href="#" className="text-white hover:text-gray-200 text-sm">Help</a>
            <Bell className="text-white h-5 w-5 cursor-pointer" />
            <div className="relative">
              <User className="text-white h-5 w-5 cursor-pointer" />
            </div>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium">
              Sign Off
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-wf-red px-4 py-2 border-t border-red-600">
            <div className="space-y-2">
              <a href="#" className="block text-white py-2">ATMs/Locations</a>
              <a href="#" className="block text-white py-2">Help</a>
              <a href="#" className="block text-white py-2">Notifications</a>
              <a href="#" className="block text-white py-2">Profile</a>
              <a href="#" className="block text-white py-2">Sign Off</a>
            </div>
          </div>
        )}

        {/* Secondary Nav */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              <Link
                to="/dashboard"
                className="py-4 whitespace-nowrap text-gray-600 hover:text-gray-900"
              >
                Accounts
              </Link>
              <Link
                to="/transfer"
                className="py-4 whitespace-nowrap text-wf-red border-b-2 border-wf-red font-medium"
              >
                Transfer & Pay
              </Link>
              <Link
                to="#"
                className="py-4 whitespace-nowrap text-gray-600 hover:text-gray-900"
              >
                Investing
              </Link>
              <Link
                to="#"
                className="py-4 whitespace-nowrap text-gray-600 hover:text-gray-900"
              >
                Loans & Credit
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TransferHeader;
