'use client';

import React from 'react';
import { Sparkles, ArrowRight, CheckCircle, ExternalLink, ShieldCheck, Scale } from 'lucide-react';
import { AlternativeProduct, ProductPreset } from '../lib/mockData';
import { CURRENCY_SYMBOLS } from './Navbar';
import { soundFX } from './AudioFX';

interface AlternativesSectionProps {
  product: ProductPreset;
  activeCurrency: string;
}

export default function AlternativesSection({
  product,
  activeCurrency
}: AlternativesSectionProps) {
  const curr = CURRENCY_SYMBOLS[activeCurrency] || CURRENCY_SYMBOLS.USD;

  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * curr.rate;
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  if (!product.alternatives || product.alternatives.length === 0) return null;

  return (
    <section className="w-full mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Scale className="w-3.5 h-3.5 text-cyan-300" />
            <span>Agentic Recommendation Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Cross-Platform Similar & Alternative Models
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Smart AI match algorithms discovered comparable high-value alternatives across multiple stores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {product.alternatives.map((alt) => {
          const priceDiff = alt.price - product.priceAnalytics.lowestPrice;
          const isCheaper = priceDiff < 0;

          return (
            <div
              key={alt.id}
              className="relative rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xl bg-[#080d24]/75 border border-indigo-500/20 hover:border-cyan-400/40 hover:bg-[#0b1333]/90 transition-all duration-300 group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${
                      alt.badge === 'Best Value'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40'
                        : alt.badge === 'Pro Upgrade'
                        ? 'bg-purple-950/80 text-purple-300 border-purple-400/40'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-400/40'
                    }`}
                  >
                    {alt.badge}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                    <Sparkles className="w-3 h-3" />
                    <span>{alt.similarityScore}% Match</span>
                  </div>
                </div>

                {/* Product Image & Info */}
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#040816] p-2 flex-shrink-0 border border-slate-800">
                    <img
                      src={alt.imageUrl}
                      alt={alt.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {alt.brand} • Available on {alt.platform}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {alt.title}
                    </h4>
                    <div className="text-xs text-amber-400 font-semibold font-mono">
                      {alt.rating} ★ ({alt.reviewsCount.toLocaleString()})
                    </div>
                  </div>
                </div>

                {/* Key AI Difference Reason */}
                <div className="p-3 rounded-xl bg-[#040816]/70 border border-slate-800/80 mb-4">
                  <span className="text-[10px] font-mono uppercase text-cyan-300 block mb-1">
                    AI Comparative Analysis:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alt.keyDifference}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-white font-mono">
                    {formatPrice(alt.price)}
                  </div>
                  <div className="text-[11px] font-mono font-semibold">
                    {isCheaper ? (
                      <span className="text-emerald-400">
                        Saves {formatPrice(Math.abs(priceDiff))}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        +{formatPrice(priceDiff)} vs Target
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={alt.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-indigo-500/30 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>View Model</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
