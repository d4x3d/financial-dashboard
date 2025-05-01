import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Shield, HelpCircle, Facebook, Twitter, Linkedin, Instagram, CreditCard, Home, History, Send, Settings, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="/images/logo-personal.svg"
                alt="Trusted"
                className="h-6 mr-2 invert"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Banking, mortgage, investing, credit card, and personal financial services from Trusted.
              The Power of Possible.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Trusted" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com/Trusted" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://www.instagram.com/Trusted" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/wells-fargo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Banking Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/transfer" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Transfer Money
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="tel:18008693557" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  1-800-869-3557
                </a>
              </li>
              <li>
                <a href="mailto:support@Trusted.com" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@Trusted.com
                </a>
              </li>
              <li>
                <a href="https://www.Trusted.com/help" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="https://www.Trusted.com/privacy-security/fraud" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Fraud
                </a>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Security</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Shield className="text-yellow-500 mr-2 h-5 w-5" />
                <span className="text-sm font-medium text-white">Secure Banking</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">
                Your security is our priority. We use industry-leading encryption to protect your data and transactions.
              </p>
              <a href="https://www.Trusted.com/privacy-security" target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors flex items-center">
                Learn about our security measures
                <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} Trusted & Company. All rights reserved. Member FDIC.
            </div>
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="https://www.Trusted.com/privacy-security/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="https://www.Trusted.com/privacy-security/terms" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="https://www.Trusted.com/privacy-security/cookies-advertising" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
