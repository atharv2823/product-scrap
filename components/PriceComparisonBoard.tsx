'use client';

import React, { useState } from 'react';
import { ExternalLink, Tag, Truck, Shield, Copy, Check, TrendingDown, ArrowUpDown, Filter, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { PlatformDeal, ProductPreset } from '../lib/mockData';
import { CURRENCY_SYMBOLS } from './Navbar';
import { soundFX } from './AudioFX';
import confetti from 'canvas-confetti';

interface PriceComparisonBoardProps {
  product: ProductPreset;
  activeCurrency: string;
}

export default function PriceComparisonBoard({
  product,
  activeCurrency
}: PriceComparisonBoardProps) {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'discount' | 'shipping' | 'rating'>('price');
  const [filterCondition, setFilterCondition] = useState<'all' | 'new' | 'refurbished'>('all');
  const [selectedDealModal, setSelectedDealModal] = useState<PlatformDeal | null>(null);

  const curr = CURRENCY_SYMBOLS[activeCurrency] || CURRENCY_SYMBOLS.USD;

  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * curr.rate;
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    soundFX.playClick();
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleChampionClick = (deal: PlatformDeal) => {
    soundFX.playDealFound();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti safe catch
    }
    setSelectedDealModal(deal);
  };

  // Filter & sort logic
  const filteredDeals = product.deals.filter((deal) => {
    if (filterCondition === 'new') return deal.condition === 'Brand New';
    if (filterCondition === 'refurbished') return deal.condition.includes('Refurbished') || deal.condition.includes('Open Box');
    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'discount') {
      const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
      const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
      return discountB - discountA;
    }
    if (sortBy === 'rating') return b.sellerRating - a.sellerRating;
    return 0;
  });

  const championDeal = product.deals.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), product.deals[0]);

  return (
    <section className="w-full mt-6 mb-12">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Multi-Marketplace Price Arbitrage Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Live Price Comparison Across All Stores
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time price crawler results with active coupon codes, shipping estimates, and stock verification.
          </p>
        </div>

        {/* Filters & Sorting Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Condition Filter */}
          <div className="flex items-center bg-[#070b22] p-1 rounded-xl border border-indigo-500/20 text-xs">
            <button
              onClick={() => {
                setFilterCondition('all');
                soundFX.playClick();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                filterCondition === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Items ({product.deals.length})
            </button>
            <button
              onClick={() => {
                setFilterCondition('new');
                soundFX.playClick();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                filterCondition === 'new'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Brand New
            </button>
            <button
              onClick={() => {
                setFilterCondition('refurbished');
                soundFX.playClick();
              }}
              className={`px-3 py-1 rounded-lg transition ${
                filterCondition === 'refurbished'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Refurbished
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'price' | 'discount' | 'shipping' | 'rating');
                soundFX.playClick();
              }}
              className="bg-[#070b22] text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-indigo-500/20 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none pr-8 hover:border-indigo-400 transition"
            >
              <option value="price">Sort: Lowest Price</option>
              <option value="discount">Sort: Highest % Off</option>
              <option value="rating">Sort: Best Seller Rating</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Champion Lowest Price Banner Card */}
      {championDeal && (
        <div className="relative rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-2xl bg-gradient-to-r from-emerald-950/40 via-[#07122e]/90 to-indigo-950/50 border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.18)]">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI Verified Lowest Price Deal</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Best Arbitrage at <span className="text-emerald-400">{championDeal.platform}</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300">
                You save <span className="font-bold text-white font-mono">{formatPrice(championDeal.originalPrice - championDeal.price)}</span> ({Math.round(((championDeal.originalPrice - championDeal.price) / championDeal.originalPrice) * 100)}% discount) compared to standard MSRP. Verified seller: <span className="text-cyan-300 font-medium">{championDeal.sellerName}</span> ({championDeal.sellerRating} ★ / {championDeal.sellerReviewsCount.toLocaleString()} reviews).
              </p>

              <div className="flex items-center gap-4 flex-wrap text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Truck className="w-4 h-4" />
                  <span>{championDeal.shipping.type} ({championDeal.shipping.estimatedDays})</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <Shield className="w-4 h-4" />
                  <span>{championDeal.returnPolicy}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:items-end justify-center space-y-3">
              <div className="text-right">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Price</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  {formatPrice(championDeal.price)}
                  <span className="text-sm font-normal text-slate-400 line-through ml-2">
                    {formatPrice(championDeal.originalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => handleChampionClick(championDeal)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy on {championDeal.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              {championDeal.couponCode && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#04081a]/80 border border-cyan-500/30 text-xs">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono font-bold text-cyan-300">{championDeal.couponCode}</span>
                  <button
                    onClick={() => handleCopyCoupon(championDeal.couponCode!)}
                    className="p-1 hover:text-white transition text-slate-400"
                    title="Copy Coupon"
                  >
                    {copiedCoupon === championDeal.couponCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[10px] text-slate-400">({championDeal.couponDiscount})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Store Platform Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedDeals.map((deal) => {
          const discountPct = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
          const isLowest = deal.id === championDeal?.id;

          return (
            <div
              key={deal.id}
              className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl border ${
                isLowest
                  ? 'bg-[#08152e]/80 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                  : 'bg-[#080d24]/80 border-indigo-500/15 hover:border-indigo-400/40 hover:bg-[#0b1333]/90'
              }`}
            >
              {/* Card Header: Platform badge & Tag */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: deal.logoColor }}
                    />
                    <span className="font-extrabold text-base text-white tracking-wide">
                      {deal.platform}
                    </span>
                  </div>

                  {deal.dealTag && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${
                        deal.dealTag === 'Lowest Price'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40'
                          : deal.dealTag === 'Fastest Delivery'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-400/40'
                          : 'bg-indigo-950/80 text-indigo-300 border-indigo-400/40'
                      }`}
                    >
                      {deal.dealTag}
                    </span>
                  )}
                </div>

                {/* Seller info & Condition */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[170px]" title={deal.sellerName}>
                      {deal.sellerName}
                    </span>
                    <span className="text-amber-400 font-semibold font-mono">
                      {deal.sellerRating} ★ ({deal.sellerReviewsCount.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/50 text-[10px] font-mono text-slate-300">
                      {deal.condition}
                    </span>
                    {deal.stockCount && deal.stockCount <= 10 && (
                      <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> Only {deal.stockCount} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini Price Sparkline History Vector */}
                <div className="p-2.5 rounded-xl bg-[#040816]/70 border border-slate-800/80 mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                    <span>30-Day Price Trend</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> -{discountPct}% Drop
                    </span>
                  </div>
                  
                  {/* SVG Sparkline */}
                  <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                    <defs>
                      <linearGradient id={`grad-${deal.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="2"
                      points={deal.priceHistory
                        .map((p, idx) => {
                          const x = (idx / (deal.priceHistory.length - 1)) * 200;
                          // Normalized y
                          const minP = Math.min(...deal.priceHistory.map((d) => d.price));
                          const maxP = Math.max(...deal.priceHistory.map((d) => d.price)) || minP + 1;
                          const y = 35 - ((p.price - minP) / (maxP - minP || 1)) * 30;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>

              {/* Card Footer: Price & Action */}
              <div className="space-y-3 pt-2 border-t border-slate-800/60">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-black text-white font-mono">
                      {formatPrice(deal.price)}
                    </div>
                    {deal.originalPrice > deal.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold font-mono">
                      {discountPct}% OFF
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {deal.shipping.type}
                    </div>
                  </div>
                </div>

                {/* Coupon bar if available */}
                {deal.couponCode && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#060c24] border border-cyan-500/20 text-[11px]">
                    <div className="flex items-center gap-1.5 text-cyan-300">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span className="font-mono font-bold">{deal.couponCode}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCoupon(deal.couponCode!)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-mono transition"
                    >
                      {copiedCoupon === deal.couponCode ? 'COPIED!' : 'COPY CODE'}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleChampionClick(deal)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-indigo-500/30 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 group"
                >
                  <span>Go to Store Deal</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Checkout Simulation Modal */}
      {selectedDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#080e29] border border-cyan-400/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedDealModal.logoColor }}
                />
                <h3 className="text-xl font-bold text-white">{selectedDealModal.platform}</h3>
              </div>
              <button
                onClick={() => setSelectedDealModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#040718] border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400 font-mono">PRODUCT TO ORDER</div>
              <div className="font-bold text-sm text-white">{product.name}</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Merchant Store:</span>
                <span className="text-xs text-cyan-300 font-semibold">{selectedDealModal.sellerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Price:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{formatPrice(selectedDealModal.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Delivery Method:</span>
                <span className="text-xs text-slate-300">{selectedDealModal.shipping.type}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={selectedDealModal.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedDealModal(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Continue to {selectedDealModal.platform} Store</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setSelectedDealModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel / Return to Scraper
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
