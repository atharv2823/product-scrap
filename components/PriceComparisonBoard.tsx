'use client';

import React, { useState } from 'react';
import { ExternalLink, Tag, Truck, Shield, Copy, Check, TrendingDown, ArrowUpDown, Filter, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { PlatformDeal, ProductPreset } from '../lib/mockData';
import { CURRENCY_SYMBOLS } from './Navbar';
import { soundFX } from './AudioFX';
import confetti from 'canvas-confetti';

interface PriceComparisonBoardProps {
  product?: ProductPreset | null;
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

  const curr = CURRENCY_SYMBOLS[activeCurrency] || CURRENCY_SYMBOLS.INR;

  const formatPrice = (amount: number) => {
    if (activeCurrency === 'INR') {
      const inrVal = amount < 1000 && amount > 0 ? Math.round(amount * 86.5) : Math.round(amount);
      return `₹${inrVal.toLocaleString('en-IN')}`;
    }
    const converted = amount * curr.rate;
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

  // Only display deal cards when the user has uploaded an image or entered text (exclude initial demo preset)
  const isUserUploaded = Boolean(
    product &&
    product.id &&
    (product.id.startsWith('custom') || product.id.startsWith('deal-') || product.id !== 'sony-wh1000xm5')
  );

  const hasDeals = Boolean(isUserUploaded && product?.deals && product.deals.length > 0);

  // Filter & sort logic
  const filteredDeals = (isUserUploaded && product?.deals ? product.deals : []).filter((deal) => {
    if (filterCondition === 'new') return deal.inStock !== false;
    if (filterCondition === 'refurbished') return deal.condition?.includes('Refurbished') || deal.condition?.includes('Open Box');
    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'discount') {
      const discountA = a.originalPrice && a.originalPrice > a.price ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
      const discountB = b.originalPrice && b.originalPrice > b.price ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
      return discountB - discountA;
    }
    if (sortBy === 'rating') return (b.sellerRating || 0) - (a.sellerRating || 0);
    return 0;
  });

  const championDeal = hasDeals && product?.deals && product.deals.length > 0
    ? product.deals.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), product.deals[0])
    : null;

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
            Real-time price crawler results with active listings, platform images, ratings, and instant purchase links.
          </p>
        </div>

        {/* Filters & Sorting Toolbar */}
        {hasDeals && (
          <div className="flex items-center gap-2 flex-wrap">
          
          {/* Condition / Stock Filter */}
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
              In Stock Only
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
        )}
      </div>

      {/* Grid of All Store Platform Deals, Awaiting Upload Placeholder, or Server Pressure Alert */}
      {!isUserUploaded ? (
        <div className="w-full rounded-2xl border border-indigo-500/20 bg-[#090d24]/90 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center space-y-4 my-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Waiting for Product Image or Text
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Upload a product image or enter text in the scanner above to compare live prices, discounts, and store listings across Amazon, Walmart, Best Buy, and eBay.
            </p>
          </div>
        </div>
      ) : !hasDeals ? (
        <div className="w-full rounded-2xl border border-amber-500/30 bg-[#090d24]/90 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center space-y-4 my-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <AlertCircle className="w-8 h-8 animate-pulse" />
          </div>
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-tight">
              Currently server running the High Pressure, Please Try again later
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Live marketplace crawlers were unable to retrieve listings at this moment. Please check back or try scanning another product.
            </p>
          </div>
        </div>
      ) : sortedDeals.length === 0 ? (
        <div className="w-full rounded-2xl border border-slate-700/50 bg-[#090d24]/90 p-8 text-center backdrop-blur-xl">
          <p className="text-sm text-slate-300">No deals match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedDeals.map((deal) => {
          const hasDiscount = Boolean(deal.originalPrice && deal.originalPrice > deal.price);
          const discountPct = hasDiscount
            ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
            : 0;
          const isLowest = deal.id === championDeal?.id;

          return (
            <div
              key={deal.id}
              className={`group relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl border ${
                isLowest
                  ? 'bg-[#08152e]/90 border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                  : 'bg-[#080d24]/90 border-indigo-500/20 hover:border-cyan-400/50 hover:bg-[#0b1333]/95 shadow-lg'
              }`}
            >
              <div>
                {/* Header: Platform badge & Stock badge */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: deal.logoColor || '#06b6d4' }}
                    />
                    <span className="font-extrabold text-sm sm:text-base text-white tracking-wide uppercase">
                      {deal.platform}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {deal.inStock ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/30">
                        Out of Stock
                      </span>
                    )}

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
                </div>

                {/* Scraped Product Image Preview */}
                {deal.imageUrl ? (
                  <div className="relative w-full h-48 mb-3.5 rounded-xl overflow-hidden bg-[#040816]/90 border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-cyan-500/40 transition">
                    <img
                      src={deal.imageUrl}
                      alt={deal.title || deal.sellerName || 'Product Image'}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#040816]/90 backdrop-blur-md border border-slate-700/60 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      {deal.platform}
                    </div>
                  </div>
                ) : null}

                {/* Scraped Product Title */}
                <h4
                  className="text-xs sm:text-sm font-bold text-white line-clamp-2 mb-2 leading-snug group-hover:text-cyan-300 transition-colors"
                  title={deal.title || deal.sellerName}
                >
                  {deal.title || deal.sellerName}
                </h4>

                {/* Seller & Rating info */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="truncate max-w-[150px] text-[11px] font-mono text-slate-400">
                    {deal.sellerName || `${deal.platform} Store`}
                  </span>
                  {deal.sellerRating ? (
                    <span className="text-amber-400 font-bold text-xs flex items-center gap-1 font-mono">
                      ★ {deal.sellerRating}
                      {deal.sellerReviewsCount ? (
                        <span className="text-slate-500 text-[10px] font-normal">
                          ({deal.sellerReviewsCount.toLocaleString()})
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="text-emerald-400 text-[10px] font-mono font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Listing
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Price & Direct Link Action */}
              <div className="space-y-3 pt-3 border-t border-slate-800/70">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                      {formatPrice(deal.price)}
                    </div>
                    {hasDiscount ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-slate-400 line-through font-mono">
                          {formatPrice(deal.originalPrice)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                          (Save {formatPrice(deal.originalPrice - deal.price)})
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {discountPct > 0 && (
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 text-xs font-black font-mono shadow-sm">
                        {discountPct}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Action Link Button */}
                <a
                  href={deal.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] group/btn cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy on {deal.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      )}

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
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedDealModal.imageUrl && (
              <div className="w-full h-36 rounded-2xl bg-[#040718] border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedDealModal.imageUrl}
                  alt={selectedDealModal.title || product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#040718] border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">SELECTED STORE ITEM</div>
              <div className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug">
                {selectedDealModal.title || product.name}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Store Platform:</span>
                <span className="text-xs text-cyan-300 font-semibold">{selectedDealModal.platform}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Merchant / Seller:</span>
                <span className="text-xs text-slate-300">{selectedDealModal.sellerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Deal Price:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{formatPrice(selectedDealModal.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Availability:</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {selectedDealModal.inStock ? 'In Stock • Ready to Order' : 'Out of Stock'}
                </span>
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
