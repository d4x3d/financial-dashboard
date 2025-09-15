import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';

interface AuthContextType {
  currentUser: Doc<'users'> | null;
  account: Doc<'accounts'> | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (userid: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<Doc<'users'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authenticate = useMutation(api.users.authenticate);
  const account = useQuery(api.accounts.getAccount, currentUser ? { userId: currentUser.userId } : 'skip');

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userid: string, password: string): Promise<boolean> => {
    try {
      const user = await authenticate({ userId: userid, password });
      if (user) {
        setCurrentUser(user);
        // Save user to localStorage (excluding password in a real app)
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    account,
    isAdmin: currentUser?.isAdmin || false,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
