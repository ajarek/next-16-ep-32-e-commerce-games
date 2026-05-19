'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KeyRound, Mail, User, Gamepad2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginPortalContent() {
  const { user, login, signup, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/';

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!email || !password) {
      setFormError('Proszę wypełnić wszystkie pola.');
      return;
    }

    if (!isLogin && !name) {
      setFormError('Proszę podać swoje imię/pseudonim.');
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          router.push(redirectUrl);
        } else {
          setFormError(res.error || 'Nieprawidłowe dane logowania.');
        }
      } else {
        const res = await signup(email, password, name);
        if (res.success) {
          if (res.error) {
            // require email verification scenario
            setFormSuccess(res.error);
          } else {
            setFormSuccess('Rejestracja pomyślna! Witamy w klubie.');
            // Log in after sign up
            const loginRes = await login(email, password);
            if (loginRes.success) {
              router.push(redirectUrl);
            }
          }
        } else {
          setFormError(res.error || 'Błąd podczas rejestracji.');
        }
      }
    } catch {
      setFormError('Wystąpił nieoczekiwany błąd.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-neonCyan border-white/10 animate-spin shadow-[0_0_15px_#00ffff]" />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-black/60 border border-white/10 rounded-2xl p-8 relative shadow-neon-cyan overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-neonCyan/10 blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-neonBlue/10 blur-[80px]" />

        {/* Heading */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-xboxGreen/10 border border-xboxGreen/20 shadow-[0_0_10px_#107c10] flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-6 h-6 text-xboxGreen" />
          </div>
          <h2 className="font-orbitron font-bold text-2xl tracking-widest text-gradient mb-2">
            STREFA GRACZA
          </h2>
          <p className="font-rajdhani text-base text-gray-400 font-semibold tracking-wider">
            {isLogin ? 'Zaloguj się do swojego profilu Xbox 360' : 'Utwórz nowy profil Xbox 360'}
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-white/10 mb-8 relative z-10">
          <button
            onClick={() => {
              setIsLogin(true);
              setFormError(null);
              setFormSuccess(null);
            }}
            className={`flex-1 pb-3 text-center font-rajdhani font-bold text-lg tracking-wider transition-colors duration-300 relative ${
              isLogin ? 'text-neonCyan' : 'text-gray-500 hover:text-white'
            }`}
          >
            Zaloguj się
            {isLogin && (
              <motion.div
                layoutId="authTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue shadow-[0_0_8px_#00ffff]"
              />
            )}
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setFormError(null);
              setFormSuccess(null);
            }}
            className={`flex-1 pb-3 text-center font-rajdhani font-bold text-lg tracking-wider transition-colors duration-300 relative ${
              !isLogin ? 'text-neonCyan' : 'text-gray-500 hover:text-white'
            }`}
          >
            Zarejestruj
            {!isLogin && (
              <motion.div
                layoutId="authTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue shadow-[0_0_8px_#00ffff]"
              />
            )}
          </button>
        </div>

        {/* Form alerts */}
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-rajdhani text-sm font-semibold tracking-wider">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-rajdhani text-sm font-semibold tracking-wider">
            {formSuccess}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-sm font-rajdhani font-bold text-gray-400 tracking-wider mb-2">
                NICK GRACZA (NAZWA)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="MasterChief117"
                  className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white font-rajdhani text-lg tracking-wider placeholder-gray-600 focus:outline-none transition-colors duration-300"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-rajdhani font-bold text-gray-400 tracking-wider mb-2">
              ADRES E-MAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gracz@xbox360.pl"
                className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white font-rajdhani text-lg tracking-wider placeholder-gray-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-rajdhani font-bold text-gray-400 tracking-wider mb-2">
              HASŁO
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white font-rajdhani text-lg tracking-wider placeholder-gray-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-lg font-bold tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? (
              <span className="w-6 h-6 border-2 border-t-black border-black/10 rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Zaloguj się' : 'Zarejestruj się'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPortal() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-neonCyan border-white/10 animate-spin shadow-[0_0_15px_#00ffff]" />
          </div>
        }>
          <LoginPortalContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
