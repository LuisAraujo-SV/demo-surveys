'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, type User } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, category: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { token, user } = await authApi.login({ email, password });
      Cookies.set('token', token);
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, category: string) => {
    try {
      setError(null);
      const { token, user } = await authApi.register({ name, email, password, category });
      Cookies.set('token', token);
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      setError('Registration failed');
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    queryClient.clear();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}