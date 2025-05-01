import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Hero = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Good morning</h2>
              <p className="text-gray-600">Sign on to manage your accounts.</p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Save Username
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800"
              >
                Sign On
              </button>
            </form>

            <div className="mt-6 space-y-2">
              <a href="#" className="block text-sm text-red-700 hover:underline">
                Forgot username or password?
              </a>
              <a href="#" className="block text-sm text-red-700 hover:underline">
                Security Center
              </a>
              <a href="#" className="block text-sm text-red-700 hover:underline">
                Privacy, Cookies, and Legal
              </a>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">
              Grow your savings with great rates
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Open a savings account or CD today.
            </p>
            <button className="bg-transparent border-2 border-red-700 text-red-700 px-6 py-3 rounded-md hover:bg-red-50">
              View your rates
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;