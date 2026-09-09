'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, Volume2, VolumeX, Bell, Globe2, Zap, ArrowUpRight, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { soundFX } from './AudioFX';
import { getCurrentUser, logoutUser, SnapPriceUser } from '../lib/auth';

interface NavbarProps {
  activeCurrency: string;
  onCurrencyChange: (curr: string) => void;
  onOpenAlertModal: () => void;
  isScanning: boolean;
  onReplayLoader?: () => void;
}

export const CURRENCY_SYMBOLS: Record<string, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  INR: { symbol: '₹', rate: 86.5, label: 'INR (₹)' },
};

export default function Navbar({
  activeCurrency,
  onCurrencyChange,
  onOpenAlertModal,
  isScanning,
  onReplayLoader
}: NavbarProps) {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentUser, setCurrentUser] = useState<SnapPriceUser | null>(null);

  useEffect(() => {
    // Initial check
    setCurrentUser(getCurrentUser());

    // Listen for auth changes
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('snapprice_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('snapprice_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    soundFX.playClick();
    logoutUser();
    router.push('/login');
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
    if (next) soundFX.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080d22]/70 border-b border-indigo-500/15 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        
        {/* Brand & Logo */}
        <Link 
          href="/" 
          onClick={() => soundFX.playClick()}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <div className="relative w-11 h-11 rounded-xl bg-[#090e24] border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 animate-bounce text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xl sm:text-2xl bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent font-sans">
                SnapPrice
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
              Autonomous Cross-Platform Price Vision & Arbitrage Engine
            </p>
          </div>
        </Link>

        {/* Live Network & Agent Swarm Status */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScanning ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isScanning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-mono text-[11px]">
              {isScanning ? 'Multi-Agent Scraping Active...' : '8 Marketplaces Connected'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={activeCurrency}
              onChange={(e) => {
                onCurrencyChange(e.target.value);
                soundFX.playClick();
              }}
              className="bg-[#0b1233]/90 text-slate-200 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-500/30 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none pr-6 sm:pr-7 hover:border-indigo-400 transition"
            >
              {Object.entries(CURRENCY_SYMBOLS).map(([code, meta]) => (
                <option key={code} value={code} className="bg-[#0b1233] text-white">
                  {meta.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="w-9 h-9 rounded-xl bg-[#0b1233]/90 border border-indigo-500/30 flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition shadow-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Price Drop Alert Modal Trigger */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenAlertModal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-600/30 hover:from-cyan-500/30 hover:to-indigo-600/40 border border-cyan-400/40 text-cyan-200 text-xs font-medium transition shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Alerts</span>
          </button>

          {/* Optional Replay Loader Button */}
          {onReplayLoader && (
            <button
              onClick={() => {
                soundFX.playClick();
                onReplayLoader();
              }}
              title="Replay SnapPrice Intro Loader"
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono transition"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Intro</span>
            </button>
          )}

          {/* Auth State Controls */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-indigo-500/20">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-200 leading-none truncate max-w-[100px]">
                      {currentUser.name}
                    </p>
                    <span className="text-[9px] text-cyan-400 font-mono capitalize">
                      {currentUser.role || 'Hunter'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out of SnapPrice"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 border border-slate-700/60 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-medium transition shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => soundFX.playClick()}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/signup"
                  onClick={() => soundFX.playClick()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition group"
                >
                  <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
