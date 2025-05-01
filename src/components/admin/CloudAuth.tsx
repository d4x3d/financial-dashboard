import React, { useState, useEffect } from 'react';
import { db } from '../../services/supabaseDb';
import { Loader, AlertCircle } from 'lucide-react';

const CloudAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authState, setAuthState] = useState<'unknown' | 'authenticated' | 'not-authenticated'>('unknown');

  useEffect(() => {
    // Check if user is already authenticated with Dexie Cloud
    const checkAuth = async () => {
      try {
        const credentials = await db.cloud.currentCredentials;
        if (credentials) {
          setAuthState('authenticated');
        } else {
          setAuthState('not-authenticated');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState('not-authenticated');
      }
    };

    checkAuth();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Request OTP (One-Time Password)
      await db.cloud.authorize(email);
      setSuccess(`A verification code has been sent to ${email}. Please check your email.`);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await db.cloud.signOut();
      setAuthState('not-authenticated');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authState === 'unknown') {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-8 w-8 text-wf-red animate-spin" />
      </div>
    );
  }

  if (authState === 'authenticated') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Cloud Authentication</h2>
        <p className="text-green-600 mb-4">
          You are authenticated with Dexie Cloud.
        </p>
        <button
          onClick={handleSignOut}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Sign Out from Cloud
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Cloud Authentication</h2>
      <p className="text-gray-600 mb-4">
        Authenticate with Dexie Cloud to enable data synchronization.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-wf-red text-white py-2 px-4 rounded-md hover:bg-red-800 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Sending verification...
            </>
          ) : (
            'Sign In with Email'
          )}
        </button>
      </form>
    </div>
  );
};

export default CloudAuth;
