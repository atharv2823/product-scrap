'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MotionBackground from '../../components/MotionBackground';
import { soundFX } from '../../components/AudioFX';
import confetti from 'canvas-confetti';
import { registerUser } from '../../lib/auth';
import {
  Bot,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  TrendingDown,
  ShoppingBag,
  Globe2,
  Check
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'hunter' | 'arbitrageur' | 'developer'>('hunter');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // States: idle | submitting | success | error
  const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.setEnabled(next);
    if (next) soundFX.playClick();
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 0) return { label: 'Empty', width: '0%', color: 'bg-slate-700' };
    if (score === 1) return { label: 'Vulnerable', width: '25%', color: 'bg-rose-500' };
    if (score === 2) return { label: 'Moderate', width: '50%', color: 'bg-amber-400' };
    if (score === 3) return { label: 'Fortified', width: '75%', color: 'bg-cyan-400' };
    return { label: 'Quantum-Safe', width: '100%', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleFillDemo = () => {
    soundFX.playClick();
    setFullName('Sarah Lin');
    setEmail('sarah.lin@arbitrage.ai');
    setPassword('QuantumSecure#2026');
    setRole('arbitrageur');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      soundFX.playClick();
      setRegStatus('error');
      setStatusMessage('Please fill all required identification fields.');
      return;
    }

    if (!agreeTerms) {
      soundFX.playClick();
      setRegStatus('error');
      setStatusMessage('Please accept the autonomous agent telemetry terms.');
      return;
    }

    const result = registerUser(fullName, email, password, role);
    if (!result.success) {
      soundFX.playClick();
      setRegStatus('error');
      setStatusMessage(result.error || 'Failed to create account.');
      return;
    }

    setRegStatus('submitting');
    setStatusMessage('Generating Sovereign SnapPrice Key & Assigning Scraping Cluster...');
    soundFX.playScanBeep();

    setTimeout(() => {
      setStatusMessage('Syncing with 8 Marketplace Crawlers...');
      soundFX.playAgentStep();
    }, 600);

    setTimeout(() => {
      setStatusMessage('Registration Complete! Redirecting to Sign In...');
      setRegStatus('success');
      soundFX.playDealFound();

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {
        // Safe catch
      }
    }, 1200);

    setTimeout(() => {
      router.push(`/login?registered=true&email=${encodeURIComponent(email)}`);
    }, 2000);
  };

  const handleSocialSignup = (provider: string) => {
    soundFX.playClick();
    const socialEmail = `${provider.toLowerCase()}_user@snapprice.ai`;
    registerUser(`${provider} User`, socialEmail, 'SocialOAuth2026!', 'hunter');

    setRegStatus('submitting');
    setStatusMessage(`Synthesizing SnapPrice ID via ${provider}...`);
    setTimeout(() => {
      setRegStatus('success');
      setStatusMessage(`Account created via ${provider}. Redirecting to Sign In...`);
      soundFX.playDealFound();
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      } catch {
        // Safe catch
      }
      setTimeout(() => {
        router.push(`/login?registered=true&email=${encodeURIComponent(socialEmail)}`);
      }, 1400);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Animated Matrix Canvas */}
      <MotionBackground />

      {/* Header Bar */}
      <header className="relative z-20 w-full backdrop-blur-xl bg-[#080d22]/70 border-b border-indigo-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
              <div className="relative w-10 h-10 rounded-xl bg-[#090e24] border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 animate-bounce text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg sm:text-xl bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  SnapPrice
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Sparkles className="w-2.5 h-2.5 animate-spin" /> NEW AGENT NODE
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

      {/* Main Dual-Column Section */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Platform Superpowers & Metrics */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>JOIN 18,500+ ARBITRAGE HUNTERS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Scrape, Match & <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Snipe Arbitrage Deals
              </span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Deploy autonomous AI vision bots that analyze live product catalogs across Amazon, Walmart, Best Buy, and eBay to uncover hidden discounts and arbitrage spreads.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#090f2e]/60 border border-indigo-500/20 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sub-500ms Optical Recognition</h4>
                  <p className="text-[11px] text-slate-400">Extracts brand, model number & SKU directly from raw camera images.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#090f2e]/60 border border-indigo-500/20 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 flex-shrink-0">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Autonomous Price Sniping</h4>
                  <p className="text-[11px] text-slate-400">Never overpay again. Immediate alerts when prices drop below your threshold.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#090f2e]/60 border border-indigo-500/20 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">8 Connected Retail Marketplaces</h4>
                  <p className="text-[11px] text-slate-400">Real-time synchronized inventory, coupons, and seller reputation audits.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Registration Card */}
          <div className="lg:col-span-7 relative">

            {/* Cyber Aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/25 via-indigo-600/25 to-fuchsia-500/25 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

            <div className="relative rounded-3xl backdrop-blur-2xl bg-[#090f2e]/95 border border-cyan-400/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5">

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Deploy Your Neural Node
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create your free SnapPrice account in seconds.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold transition hover:scale-105 active:scale-95 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>1-Click Demo Fill</span>
                </button>
              </div>

              {/* Status Banner */}
              {regStatus === 'error' && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {regStatus === 'submitting' && (
                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="font-mono text-[11px]">{statusMessage}</span>
                </div>
              )}

              {regStatus === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span className="font-semibold">{statusMessage}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name & Email (2-col on tablet/desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sarah Lin"
                        required
                        className="w-full bg-[#0b1338]/90 border border-indigo-500/30 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@domain.com"
                        required
                        className="w-full bg-[#0b1338]/90 border border-indigo-500/30 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Strength Meter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 tracking-wide uppercase">
                    Master Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters with numbers & symbols"
                      required
                      className="w-full bg-[#0b1338]/90 border border-indigo-500/30 rounded-xl pl-10 pr-11 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setShowPassword(!showPassword);
                      }}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-400 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="pt-1 space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Entropy Analysis:</span>
                        <span className="font-bold text-cyan-300">{strength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: strength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>


                {/* Terms Agreement */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="termsCheck"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded bg-[#0b1338] border border-indigo-500/40 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-500"
                  />
                  <label htmlFor="termsCheck" className="text-xs text-slate-300 leading-tight cursor-pointer">
                    I agree to the <span className="text-cyan-400 underline">Autonomous Agent Terms of Service</span> & telemetry protocols.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={regStatus === 'submitting'}
                  onClick={() => soundFX.playClick()}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer group"
                >
                  <span>Initialize & Deploy Agent Node</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Bottom Login Switcher */}
              <div className="pt-1 text-center text-xs text-slate-400">
                <span>Already have a SnapPrice account? </span>
                <Link
                  href="/login"
                  onClick={() => soundFX.playClick()}
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition"
                >
                  Sign In to Terminal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t border-indigo-500/10 text-center text-[11px] text-slate-500 font-mono">
        <span>SnapPrice SOVEREIGN IDENTITY REGISTRY • LEVEL 4 ENCRYPTION • 2026</span>
      </footer>
    </div>
  );
}
