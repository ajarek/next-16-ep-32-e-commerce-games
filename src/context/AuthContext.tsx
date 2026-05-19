'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '@/lib/insforge';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  profile?: {
    name?: string;
    avatar_url?: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; requireVerification?: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROTECTED_ROUTES = ['/cart', '/checkout', '/orders'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error) {
        setUser(null);
      } else if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          profile: data.user.profile,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to get current user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Route protection logic
  useEffect(() => {
    if (!loading) {
      const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
      if (isProtected && !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          profile: data.user.profile,
        });
        return { success: true };
      }
      return { success: false, error: 'Błąd logowania' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create user
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // After sign up, if email verification is not required, log them in or ask to login
      if (data?.accessToken && data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          profile: data.user.profile,
        });
        return { success: true };
      } else if (data?.requireEmailVerification) {
        // If email verification is enabled, they need to verify.
        return { success: true, requireVerification: true, error: 'Konto zarejestrowane. Wymagana weryfikacja e-mail.' };
      }

      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd';
      return { success: false, error: errorMsg };
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      const { data, error } = await insforge.auth.verifyEmail({ email, otp });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.accessToken && data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          profile: data.user.profile,
        });
        return { success: true };
      }
      return { success: false, error: 'Nie udało się zweryfikować e-maila.' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd podczas weryfikacji';
      return { success: false, error: errorMsg };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const { data, error } = await insforge.auth.resendVerificationEmail({ email });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: 'Nie udało się wysłać kodu weryfikacyjnego.' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd podczas wysyłania';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await insforge.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser, verifyEmail, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
