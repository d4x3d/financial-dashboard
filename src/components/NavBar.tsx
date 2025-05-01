import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MapPin, HelpCircle, ArrowRightLeft, LogOut, LogIn, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavBarProps {
  isLoggedIn?: boolean;
  onSignOut?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn = false, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOn = () => {
    navigate('/dashboard');
  };

  return (
    <header className="bg-wf-red border-b-4 border-wf-yellow shadow-md">
      <nav className="max-w-7xl mx-auto">
        {/* Top Nav */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/images/wf_logo_220x23.png"
              alt="Financial Dashboard"
              width="220"
              height="23"
              className="max-h-10 w-auto my-2"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-200 text-base flex items-center">
              <MapPin className="h-5 w-5 mr-2" /> ATMs/Locations
            </a>
            <a href="#" className="text-white hover:text-gray-200 text-base flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" /> Help
            </a>
            {isLoggedIn && (
              <>
                <Link to="/transfer" className="text-white hover:text-gray-200 text-base flex items-center">
                  <ArrowRightLeft className="h-5 w-5 mr-2" /> Transfer
                </Link>
                <Link to="/transactions" className="text-white hover:text-gray-200 text-base flex items-center">
                  <History className="h-5 w-5 mr-2" /> Transactions
                </Link>
              </>
            )}
            {!isLoggedIn && <Search className="text-white h-5 w-5 cursor-pointer" />}
            <button
              onClick={isLoggedIn ? onSignOut : handleSignOn}
              className="bg-white text-gray-900 px-5 py-3 rounded-full hover:bg-gray-100 transition-colors text-base font-medium flex items-center"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="h-5 w-5 mr-2" /> Sign Off
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" /> Sign On
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white relative z-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-8 w-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-8 w-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-wf-red px-4 border-t border-red-600 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div
                className="space-y-3 py-3"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.a
                  href="#"
                  className="block text-white py-3 text-base flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <MapPin className="h-5 w-5 mr-2" /> ATMs/Locations
                </motion.a>
                <motion.a
                  href="#"
                  className="block text-white py-3 text-base flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <HelpCircle className="h-5 w-5 mr-2" /> Help
                </motion.a>
                {isLoggedIn && (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                    >
                      <Link to="/transfer" className="block text-white py-3 text-base flex items-center">
                        <ArrowRightLeft className="h-5 w-5 mr-2" /> Transfer
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Link to="/transactions" className="block text-white py-3 text-base flex items-center">
                        <History className="h-5 w-5 mr-2" /> Transactions
                      </Link>
                    </motion.div>
                  </>
                )}
                {isLoggedIn ? (
                  <motion.button
                    onClick={onSignOut}
                    className="block text-white py-3 w-full text-left text-base flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Sign Off
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSignOn}
                    className="block text-white py-3 w-full text-left text-base flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <LogIn className="h-5 w-5 mr-2" /> Sign On
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary Nav - Only for non-logged in users */}
        {!isLoggedIn && (
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8 overflow-x-auto">
                <a href="#" className="py-5 text-wf-red border-b-2 border-wf-red whitespace-nowrap font-medium text-base">Personal</a>
                <a href="#" className="py-5 text-gray-600 hover:text-gray-900 whitespace-nowrap text-base">Investing & Wealth Management</a>
                <a href="#" className="py-5 text-gray-600 hover:text-gray-900 whitespace-nowrap text-base">Small Business</a>
                <a href="#" className="py-5 text-gray-600 hover:text-gray-900 whitespace-nowrap text-base">Commercial Banking</a>
                <a href="#" className="py-5 text-gray-600 hover:text-gray-900 whitespace-nowrap text-base">Corporate & Investment Banking</a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
