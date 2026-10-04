'use client';

import React, { useEffect, Suspense } from 'react';
import { create } from 'zustand';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import MotionBackground from '../../components/MotionBackground';
import { soundFX } from '../../components/AudioFX';
import { setStoredSession, DEMO_USER, DEMO_PASSWORD } from '../../lib/auth';
import {
  Bot,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

type AuthStatus = 'idle' | 'authenticating' | 'success' | 'error';

interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  soundEnabled: boolean;
  authStatus: AuthStatus;
  statusMessage: string;
  forgotModalOpen: boolean;
  resetEmail: string;
  resetSent: boolean;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean | ((prev: boolean) => boolean)) => void;
  toggleShowPassword: () => void;
  setRememberMe: (remember: boolean | ((prev: boolean) => boolean)) => void;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setStatusMessage: (msg: string) => void;
  setForgotModalOpen: (open: boolean) => void;
  setResetEmail: (email: string) => void;
  setResetSent: (sent: boolean) => void;
  resetLoginForm: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
  email: '',
  password: '',
  showPassword: false,
  rememberMe: true,
  soundEnabled: true,
  authStatus: 'idle',
  statusMessage: '',
  forgotModalOpen: false,
  resetEmail: '',
  resetSent: false,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setShowPassword: (showPassword) =>
    set((state) => ({
      showPassword:
        typeof showPassword === 'function' ? showPassword(state.showPassword) : showPassword,
    })),
  toggleShowPassword: () => set((state) => ({ showPassword: !state.showPassword })),
  setRememberMe: (rememberMe) =>
    set((state) => ({
      rememberMe:
        typeof rememberMe === 'function' ? rememberMe(state.rememberMe) : rememberMe,
    })),
  setSoundEnabled: (soundEnabled) =>
    set((state) => ({
      soundEnabled:
        typeof soundEnabled === 'function' ? soundEnabled(state.soundEnabled) : soundEnabled,
    })),
  setAuthStatus: (authStatus) => set({ authStatus }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setForgotModalOpen: (forgotModalOpen) => set({ forgotModalOpen }),
  setResetEmail: (resetEmail) => set({ resetEmail }),
  setResetSent: (resetSent) => set({ resetSent }),
  resetLoginForm: () =>
    set({
      email: '',
      password: '',
      showPassword: false,
      rememberMe: true,
      authStatus: 'idle',
      statusMessage: '',
      forgotModalOpen: false,
      resetEmail: '',
      resetSent: false,
    }),
}));

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isRegisteredParam = searchParams.get('registered') === 'true';
  const emailParam = searchParams.get('email') || '';

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    soundEnabled,
    setSoundEnabled,
    authStatus,
    setAuthStatus,
    statusMessage,
    setStatusMessage,
    forgotModalOpen,
    setForgotModalOpen,
    resetEmail,
    setResetEmail,
    resetSent,
    setResetSent,
  } = useLoginStore();

  // If email param changes, update email state
  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam, email]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
    if (next) soundFX.playClick();
  };

  const handleFillDemo = () => {
    soundFX.playClick();
    setEmail('atharva@gmail.com');
    setPassword('pass123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      soundFX.playClick();
      setAuthStatus('error');
      setStatusMessage('Please provide both neural email and master key.');
      return;
    }

    setAuthStatus('authenticating');
    setStatusMessage('Handshaking with SnapPrice Authentication Swarm...');
    soundFX.playScanBeep();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const token = response.data?.access_token;
      if (token) {
        // Store access_token in session
        sessionStorage.setItem('access_token', token);
      }

      // Update active user session for UI components like Navbar
      setStoredSession({
        id: email.trim(),
        name: email.split('@')[0],
        email: email.trim(),
        role: 'hunter',
        createdAt: new Date().toISOString(),
      });

      setStatusMessage('Authentication successful! Launching SnapPrice Dashboard...');
      setAuthStatus('success');
      soundFX.playSuccessTone();

      setTimeout(() => {
        router.push('/');
      }, 700);
    } catch (err: unknown) {
      soundFX.playClick();
      setAuthStatus('error');

      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        const msg =
          errorData?.message ||
          errorData?.error ||
          (err.response?.status === 401
            ? 'Invalid credentials. Please verify your email and password.'
            : 'Authentication failed. Please verify credentials.');
        setStatusMessage(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setStatusMessage('Authentication failed. Please check server connectivity.');
      }
    }
  };


  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    soundFX.playSuccessTone();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModalOpen(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Animated Matrix Background */}
      <MotionBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full backdrop-blur-xl bg-[#080d22]/70 border-b border-indigo-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex items-center justify-center">
              <img src='/pricing.png' className='w-10 h-10 ' />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg sm:text-xl bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  SnapPrice
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="w-9 h-9 rounded-xl bg-[#0b1233]/90 border border-indigo-500/30 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition shadow-sm"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <Link
              href="/"
              onClick={() => soundFX.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0b1233]/80 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md relative">

          {/* Cyber Ambient Aura behind card */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-indigo-600/30 to-fuchsia-500/30 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

          {/* Futuristic Card */}
          <div className="relative rounded-3xl backdrop-blur-2xl bg-[#090f2e]/90 border border-cyan-400/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-6">

            {/* Top Badge & Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono font-semibold tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <KeyRound className="w-3 h-3 text-cyan-400" />
                <span>AUTHENTICATION PROTOCOL</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Initialize Session
              </h1>

              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Sign in to manage live visual scrapes, price alerts, and automated arbitrage triggers.
              </p>
            </div>

            {/* Registration Success Banner */}
            {isRegisteredParam && authStatus === 'idle' && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 animate-pulse" />
                <div>
                  <p className="font-bold text-white text-xs">Registration Complete!</p>
                  <p className="text-[11px] text-emerald-300/90 leading-tight">
                    Your SnapPrice account has been created. Enter your master key below to sign in.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Demo Fill Accelerator */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-medium">Testing the UI?</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold transition hover:scale-105 active:scale-95 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <span>⚡ Auto-fill Demo Pro Account</span>
              </button>
            </div>

            {/* Status Notification */}
            {authStatus === 'error' && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{statusMessage}</span>
              </div>
            )}

            {authStatus === 'authenticating' && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="font-mono text-[11px]">{statusMessage}</span>
              </div>
            )}

            {authStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span className="font-semibold">{statusMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
                  Neural Identity / Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pro_hunter@SnapPrice"
                    required
                    className="w-full bg-[#0b1338]/90 border border-indigo-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
                    Master Key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition"
                  >
                    Forgot key?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#0b1338]/90 border border-indigo-500/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0b1338] border-indigo-500/40 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Retain neural token on device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authStatus === 'authenticating'}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm transition-all duration-300 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-500 group-hover:opacity-100 transition-opacity" />
                <div className="relative px-6 py-3 rounded-xl bg-[#090f2e] group-hover:bg-opacity-80 transition flex items-center justify-center gap-2 text-white">
                  <span>Sign In to SnapPrice</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>

            {/* Bottom Register Switcher */}
            <div className="pt-2 text-center text-xs text-slate-400">
              <span>New to SnapPrice? </span>
              <Link
                href="/signup"
                onClick={() => soundFX.playClick()}
                className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>

          {/* Security & Cryptography Assurance Footer */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 256-Bit</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero-Knowledge</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Agent Guard</span>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl backdrop-blur-2xl bg-[#090f2e] border border-cyan-400/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Master Key</h3>
                <p className="text-[11px] text-slate-400">Recover your SnapPrice node</p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-xs font-semibold text-emerald-200">Recovery Token Dispatched</p>
                <p className="text-[11px] text-slate-400">Check your neural inbox for instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter your registered neural email to receive a secure one-time recovery key.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-[#0b1338] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-semibold text-white shadow-md hover:brightness-110"
                  >
                    Send Recovery Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Global Minimal Footer */}
      <footer className="relative z-10 py-4 border-t border-indigo-500/10 text-center text-[11px] text-slate-500 font-mono">
        <span>SnapPrice SYSTEM CORE • NODE SECURE GATEWAY • AGENTIC COMMERCE</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050714] flex items-center justify-center text-cyan-400 font-mono text-xs">
          Loading SnapPrice Gateway...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
