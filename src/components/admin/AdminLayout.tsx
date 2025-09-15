import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Users, DollarSign, FileText, Cloud } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CloudAuth from './CloudAuth';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCloudAuth, setShowCloudAuth] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 fixed h-full transition-all duration-300 ease-in-out z-10 ${
          isSidebarOpen ? 'left-0' : '-left-64'
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="text-xl font-bold text-white">
              Admin Panel
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="bg-wf-red rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser?.fullName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/admin"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <Users className="h-5 w-5 mr-3" />
              User Management
            </Link>
            <Link
              to="/admin/accounts"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Account Management
            </Link>
            <Link
              to="/admin/transactions"
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <FileText className="h-5 w-5 mr-3" />
              Pending Transactions
            </Link>
            <button
              onClick={() => setShowCloudAuth(!showCloudAuth)}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <Cloud className="h-5 w-5 mr-3" />
              Cloud Sync
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <img
                src="/tdamcb-mobile-logo.png"
                alt="Financial Dashboard"
                width="220"
                height="23"
                className="max-h-10 w-auto my-2"
              />
              <span className="ml-2 text-gray-700 font-medium">Admin Portal</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {showCloudAuth ? (
            <CloudAuth />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
