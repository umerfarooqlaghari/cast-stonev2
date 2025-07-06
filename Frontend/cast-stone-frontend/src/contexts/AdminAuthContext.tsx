'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/types/entities';
import { userGetService } from '@/services/api/users/get';

interface AdminAuthContextType {
  admin: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedAdmin = localStorage.getItem('admin_session');
        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          // Verify the session is still valid (simple check)
          if (adminData.email && adminData.role === 'admin') {
            setAdmin(adminData);
          } else {
            localStorage.removeItem('admin_session');
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        localStorage.removeItem('admin_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const adminUser = await userGetService.validateAdminCredentials(email, password);
      
      if (adminUser) {
        setAdmin(adminUser);
        // Store session in localStorage (in production, use secure httpOnly cookies)
        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_session');
  };

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
