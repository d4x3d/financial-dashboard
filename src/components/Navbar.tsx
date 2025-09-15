import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-wf-red border-b-4 border-wf-yellow shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/tdamcb-mobile-logo.png"
                alt="Financial Dashboard"
                width="220"
                height="23"
                className="max-h-10 w-auto my-2"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-gray-200">ATMs/Locations</a>
            <a href="#" className="text-white hover:text-gray-200">Help</a>
            <a href="#" className="text-white hover:text-gray-200">About Us</a>
            <a href="#" className="text-white hover:text-gray-200">Español</a>
            <Search className="h-5 w-5 text-white" />
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full hover:bg-gray-100 transition-colors text-base font-medium">
              Sign On
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-wf-red">
            <div className="pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-white hover:text-gray-200">ATMs/Locations</a>
              <a href="#" className="block px-3 py-2 text-white hover:text-gray-200">Help</a>
              <a href="#" className="block px-3 py-2 text-white hover:text-gray-200">About Us</a>
              <a href="#" className="block px-3 py-2 text-white hover:text-gray-200">Español</a>
              <button className="w-full text-left px-3 py-2 bg-white text-gray-900 rounded-full my-2">
                Sign On
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;