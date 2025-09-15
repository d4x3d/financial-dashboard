import React, { useState, useEffect } from 'react';
import WellGoFar from './WellGoFar';
import WellGoFarLogin from './WellGoFarLogin';

const WellGoFarAuth: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      setLoading(true);

      try {
        console.log('Checking admin session...');

        // First check localStorage
        const savedUser = localStorage.getItem('wellgofar_admin');

        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user && user.isAdmin) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Session verification error:', error);
        localStorage.removeItem('wellgofar_admin');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wf-red"></div>
      </div>
    );
  }

  // If no session, show login
  if (!isAdmin) {
    return <WellGoFarLogin />;
  }

  // If authenticated, show admin page
  return <WellGoFar />;
};

export default WellGoFarAuth;
