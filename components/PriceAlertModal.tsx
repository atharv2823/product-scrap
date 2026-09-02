'use client';

import React, { useState } from 'react';
import { Bell, X, CheckCircle2, Sparkles, Mail, Shield, ArrowRight } from 'lucide-react';
import { ProductPreset } from '../lib/mockData';
import { CURRENCY_SYMBOLS } from './Navbar';
import { soundFX } from './AudioFX';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductPreset;
  activeCurrency: string;
}

export default function PriceAlertModal({
  isOpen,
  onClose,
  product,
  activeCurrency
}: PriceAlertModalProps) {
  const curr = CURRENCY_SYMBOLS[activeCurrency] || CURRENCY_SYMBOLS.USD;
  const initialTarget = Math.round(product.priceAnalytics.lowestPrice * 0.9);

  const [targetPrice, setTargetPrice] = useState<number>(initialTarget);
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'instant' | 'daily'>('instant');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundFX.playSuccessTone();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl backdrop-blur-2xl bg-[#090f2e]/95 border border-cyan-400/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.3)] space-y-5">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Create AI Price Drop Alert
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous bots will monitor 8 marketplaces 24/7.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-400/50 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-lg font-bold text-white">Alert Configured Successfully!</h4>
            <p className="text-xs text-slate-300">
              We will notify <span className="text-cyan-300 font-semibold">{email}</span> the moment {product.name} drops below {curr.symbol}{(targetPrice * curr.rate).toFixed(2)}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Target Product Summary */}
            <div className="p-3.5 rounded-2xl bg-[#050818] border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black/50 p-1 flex-shrink-0">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{product.name}</div>
                <div className="text-[11px] font-mono text-emerald-400">
                  Current Lowest: {curr.symbol}{(product.priceAnalytics.lowestPrice * curr.rate).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Target Price Range Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Desired Target Alert Price</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {curr.symbol}{(targetPrice * curr.rate).toFixed(2)} ({Math.round(((product.priceAnalytics.lowestPrice - targetPrice) / product.priceAnalytics.lowestPrice) * 100)}% Drop)
                </span>
              </div>
              <input
                type="range"
                min={Math.round(product.priceAnalytics.lowestPrice * 0.5)}
                max={Math.round(product.priceAnalytics.lowestPrice * 0.98)}
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>50% Off ({curr.symbol}{(product.priceAnalytics.lowestPrice * 0.5 * curr.rate).toFixed(0)})</span>
                <span>All-Time Low ({curr.symbol}{(product.priceAnalytics.allTimeLow * curr.rate).toFixed(0)})</span>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Notification Email / Webhook</span>
              </label>
              <input
                type="email"
                required
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#060a22] border border-indigo-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Frequency options */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFrequency('instant')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  frequency === 'instant'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-[#060a20] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Instant Push Alert
              </button>
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  frequency === 'daily'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-[#060a20] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Daily Digest
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Activate 24/7 Price Tracker</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
