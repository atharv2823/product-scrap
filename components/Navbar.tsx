'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Volume2, VolumeX, Bell, Globe2, Zap, ArrowUpRight } from 'lucide-react';
import { soundFX } from './AudioFX';

interface NavbarProps {
  activeCurrency: string;
  onCurrencyChange: (curr: string) => void;
  onOpenAlertModal: () => void;
  isScanning: boolean;
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
  isScanning
}: NavbarProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
    if (next) soundFX.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080d22]/70 border-b border-indigo-500/15 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-11 h-11 rounded-xl bg-[#090e24] border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <Bot className="w-6 h-6 animate-bounce text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xl sm:text-2xl bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent font-sans">
                PRICESYNC<span className="text-cyan-400">.AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Sparkles className="w-2.5 h-2.5 animate-spin" /> AGENTIC V2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
              Autonomous Cross-Platform Price Vision & Arbitrage Engine
            </p>
          </div>
        </div>

        {/* Live Network & Agent Swarm Status */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScanning ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isScanning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-mono text-[11px]">
              {isScanning ? 'Multi-Agent Scraping Active...' : '8 Marketplaces Connected'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-time Arbitrage</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={activeCurrency}
              onChange={(e) => {
                onCurrencyChange(e.target.value);
                soundFX.playClick();
              }}
              className="bg-[#0b1233]/90 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-500/30 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none pr-7 hover:border-indigo-400 transition"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-600/30 hover:from-cyan-500/30 hover:to-indigo-600/40 border border-cyan-400/40 text-cyan-200 text-xs font-medium transition shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Set Price Alert</span>
          </button>
        </div>
      </div>
    </header>
  );
}
