import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const CloudAuth: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
      {currentUser ? (
        <div className="space-y-4">
          <p>
            You are logged in as: <span className="font-medium">{currentUser.userId}</span>
          </p>
          <p>
            Admin status: <span className="font-medium">{isAdmin ? 'Yes' : 'No'}</span>
          </p>
          <Button onClick={logout} variant="destructive">
            Log Out
          </Button>
        </div>
      ) : (
        <p>You are not currently authenticated.</p>
      )}
    </div>
  );
};

export default CloudAuth;