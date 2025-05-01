import React, { useState, useEffect } from 'react';
import WellGoFar from './WellGoFar';
import WellGoFarLogin from './WellGoFarLogin';
import { supabase, isAdmin } from '../../services/supabase';

const WellGoFarAuth: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setLoading(true);

      try {
        console.log('Checking admin session...');

        // First check localStorage
        const savedSession = localStorage.getItem('wellgofar_admin');

        if (savedSession) {
          console.log('Found stored session, verifying with Supabase...');
          const parsedSession = JSON.parse(savedSession);

          // Verify the session with Supabase
          const { data, error } = await supabase.auth.getSession();

          console.log('Supabase session response:', { data, error });

          if (error) {
            console.error('Session verification error:', error);
            localStorage.removeItem('wellgofar_admin');
          } else if (data && data.session) {
            // Check if the user is an admin
            const adminStatus = await isAdmin(data.session.user);
            console.log('Admin status check:', { adminStatus, user: data.session.user });

            if (adminStatus) {
              console.log('Valid admin session found');
              setSession(data.session);
            } else {
              console.log('User is not an admin');
              localStorage.removeItem('wellgofar_admin');
            }
          } else {
            console.log('No active session found');
            localStorage.removeItem('wellgofar_admin');
          }
        } else {
          console.log('No stored session found');
        }
      } catch (error) {
        console.error('Session verification error:', error);
        localStorage.removeItem('wellgofar_admin');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', { event, session });

        if (session) {
          console.log('New session detected, updating state');
          setSession(session);
          localStorage.setItem('wellgofar_admin', JSON.stringify(session));
        } else {
          console.log('Session ended, clearing state');
          setSession(null);
          localStorage.removeItem('wellgofar_admin');
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wf-red"></div>
      </div>
    );
  }

  // If no session, show login
  if (!session) {
    return <WellGoFarLogin />;
  }

  // If authenticated, show admin page
  return <WellGoFar />;
};

export default WellGoFarAuth;
