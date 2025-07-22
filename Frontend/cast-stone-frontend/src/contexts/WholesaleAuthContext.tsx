'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthenticationResult } from '@/services/types/entities';
import { authService } from '@/services';

interface WholesaleAuthContextType {
  user: User | null;
  isLoading: boolean;
  isApprovedWholesaleBuyer: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  checkWholesaleStatus: (email: string) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const WholesaleAuthContext = createContext<WholesaleAuthContextType | undefined>(undefined);

interface WholesaleAuthProviderProps {
  children: ReactNode;
}

export function WholesaleAuthProvider({ children }: WholesaleAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApprovedWholesaleBuyer, setIsApprovedWholesaleBuyer] = useState(false);

  const checkWholesaleStatus = async (email: string): Promise<boolean> => {
    try {
      console.log('Checking wholesale status for:', email);
      const response = await authService.checkWholesaleStatus(email);
      console.log('Wholesale status response:', response);
      return response.success && response.data === true;
    } catch (error) {
      console.error('Error checking wholesale status:', error);
      return false;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        console.log('Checking for existing session...');
        const storedSession = localStorage.getItem('wholesale_session');
        console.log('Stored session:', storedSession);
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          console.log('Session data:', sessionData);
          // Verify the session is still valid
          if (sessionData.email && sessionData.role === 'WholesaleBuyer') {
            console.log('Valid session found, setting user');
            setUser(sessionData);
            // Check if user is still approved
            const isApproved = await checkWholesaleStatus(sessionData.email);
            console.log('User approval status:', isApproved);
            setIsApprovedWholesaleBuyer(isApproved);

            // If user is no longer approved, clear session
            if (!isApproved) {
              console.log('User no longer approved, clearing session');
              localStorage.removeItem('wholesale_session');
              setUser(null);
            }
          } else {
            console.log('Invalid session data, clearing');
            localStorage.removeItem('wholesale_session');
          }
        } else {
          console.log('No stored session found');
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('wholesale_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('Attempting login for:', email);
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      console.log('Login response:', response);

      if (response.success && response.data) {
        const authResult: AuthenticationResult = response.data;
        console.log('Auth result:', authResult);

        if (authResult.isValid && authResult.user) {
          console.log('Setting user:', authResult.user);
          console.log('Is approved wholesale buyer:', authResult.isApprovedWholesaleBuyer);
          setUser(authResult.user);
          setIsApprovedWholesaleBuyer(authResult.isApprovedWholesaleBuyer);

          // Store session in localStorage (in production, use secure httpOnly cookies)
          localStorage.setItem('wholesale_session', JSON.stringify(authResult.user));

          return { success: true };
        } else {
          console.log('Auth result invalid or no user');
          return { success: false, error: authResult.errorMessage || 'Invalid credentials' };
        }
      }

      console.log('Login response not successful');
      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsApprovedWholesaleBuyer(false);
    localStorage.removeItem('wholesale_session');
  };



  const refreshUserData = async (): Promise<void> => {
    if (!user?.email) return;
    
    try {
      const response = await authService.getUserByEmail(user.email);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('wholesale_session', JSON.stringify(response.data));
        
        // Check wholesale status
        const isApproved = await checkWholesaleStatus(user.email);
        setIsApprovedWholesaleBuyer(isApproved);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: WholesaleAuthContextType = {
    user,
    isLoading,
    isApprovedWholesaleBuyer,
    login,
    logout,
    isAuthenticated: !!user,
    checkWholesaleStatus,
    refreshUserData
  };

  return (
    <WholesaleAuthContext.Provider value={value}>
      {children}
    </WholesaleAuthContext.Provider>
  );
}

export function useWholesaleAuth() {
  const context = useContext(WholesaleAuthContext);
  if (context === undefined) {
    throw new Error('useWholesaleAuth must be used within a WholesaleAuthProvider');
  }
  return context;
}
