'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MotionBackground from '../components/MotionBackground';
import Navbar from '../components/Navbar';
import ImageScanner, { ProductSearchResponse } from '../components/ImageScanner';
import AgentPipeline from '../components/AgentPipeline';
import PriceComparisonBoard from '../components/PriceComparisonBoard';
import AlternativesSection from '../components/AlternativesSection';
import AIChatBot from '../components/AIChatBot';
import PriceAlertModal from '../components/PriceAlertModal';
import SnapPriceLoader from '../components/SnapPriceLoader';
import { PRODUCT_PRESETS, ProductPreset, PlatformDeal } from '../lib/mockData';
import { soundFX } from '../components/AudioFX';
import { isAuthenticated, getCurrentUser } from '../lib/auth';
import { Sparkles, Shield, Cpu, Zap, ArrowRight, Layers, Bot } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentProduct, setCurrentProduct] = useState<ProductPreset>(PRODUCT_PRESETS[0]);
  const [activeCurrency, setActiveCurrency] = useState('INR');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  // Multi-agent execution simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [agentStage, setAgentStage] = useState(5);
  const [isAgentComplete, setIsAgentComplete] = useState(true);

  useEffect(() => {
    setMounted(true);
    const auth = isAuthenticated();
    setIsLoggedIn(auth);
    if (!auth) {
      setShowLoader(true);
    }

    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener('snapprice_auth_change', handleAuthChange);
    return () => window.removeEventListener('snapprice_auth_change', handleAuthChange);
  }, []);

  const triggerAgentPipeline = (productToScan: ProductPreset) => {
    setIsScanning(true);
    setIsAgentComplete(false);
    setAgentStage(1);
    soundFX.playScanBeep();

    // Progress through the 5 autonomous stages
    setTimeout(() => {
      setAgentStage(2);
      soundFX.playAgentStep();
    }, 400);

    setTimeout(() => {
      setAgentStage(3);
      soundFX.playAgentStep();
    }, 800);

    setTimeout(() => {
      setAgentStage(4);
      soundFX.playAgentStep();
    }, 1200);

    setTimeout(() => {
      setAgentStage(5);
      soundFX.playAgentStep();
    }, 1600);

    setTimeout(() => {
      setIsScanning(false);
      setIsAgentComplete(true);
      soundFX.playDealFound();
    }, 2000);
  };

  const handleSelectPreset = (preset: ProductPreset) => {
    setCurrentProduct(preset);
    triggerAgentPipeline(preset);
  };

  const handleCustomImageUpload = (
    imageUrl: string,
    customName?: string,
    searchResult?: ProductSearchResponse
  ) => {
    let name = customName || 'Custom Product Detected via Vision AI';
    let brand = 'Identified Brand';
    let deals: PlatformDeal[] = [
      {
        id: 'custom-walmart',
        platform: 'Walmart',
        logoColor: '#0071dc',
        sellerName: 'Walmart Verified Direct',
        sellerRating: 4.8,
        sellerReviewsCount: 14200,
        price: 199.99,
        originalPrice: 289.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Free Returns',
        dealTag: 'Lowest Price',
        couponCode: 'VISUALDEAL20',
        couponDiscount: '$20 Instant Promo Code',
        productUrl: 'https://www.walmart.com',
        priceHistory: [
          { date: 'Aug 01', price: 289 },
          { date: 'Aug 08', price: 269 },
          { date: 'Aug 15', price: 239 },
          { date: 'Aug 22', price: 219 },
          { date: 'Sep 01', price: 199 }
        ]
      },
      {
        id: 'custom-amazon',
        platform: 'Amazon',
        logoColor: '#ff9900',
        sellerName: 'Amazon Fulfilled Official',
        sellerRating: 4.9,
        sellerReviewsCount: 39000,
        price: 219.00,
        originalPrice: 289.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Prime Next-Day',
          cost: 0,
          estimatedDays: 'Tomorrow Morning'
        },
        condition: 'Brand New',
        returnPolicy: 'Amazon 30-Day Guarantee',
        dealTag: 'Fastest Delivery',
        productUrl: 'https://www.amazon.com',
        priceHistory: [
          { date: 'Aug 01', price: 289 },
          { date: 'Aug 08', price: 279 },
          { date: 'Aug 15', price: 259 },
          { date: 'Aug 22', price: 239 },
          { date: 'Sep 01', price: 219 }
        ]
      },
      {
        id: 'custom-bestbuy',
        platform: 'Best Buy',
        logoColor: '#0046be',
        sellerName: 'Best Buy Outlet',
        sellerRating: 4.9,
        sellerReviewsCount: 18000,
        price: 229.99,
        originalPrice: 289.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: 'In-Store Pickup Available'
        },
        condition: 'Brand New',
        returnPolicy: '15-Day Return Window',
        dealTag: 'Best Value',
        productUrl: 'https://www.bestbuy.com',
        priceHistory: [
          { date: 'Aug 01', price: 289 },
          { date: 'Aug 08', price: 289 },
          { date: 'Aug 15', price: 269 },
          { date: 'Aug 22', price: 249 },
          { date: 'Sep 01', price: 229 }
        ]
      },
      {
        id: 'custom-ebay',
        platform: 'eBay',
        logoColor: '#e53238',
        sellerName: 'ProTech_Certified',
        sellerRating: 4.96,
        sellerReviewsCount: 29000,
        price: 169.99,
        originalPrice: 289.99,
        currency: 'USD',
        inStock: true,
        stockCount: 3,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3-4 Business Days'
        },
        condition: 'Refurbished (Certified)',
        returnPolicy: '1-Year Warranty Protection',
        dealTag: 'Certified Refurbished',
        couponCode: 'REFURBTECH',
        couponDiscount: '10% Extra Discount',
        productUrl: 'https://www.ebay.com',
        priceHistory: [
          { date: 'Aug 01', price: 210 },
          { date: 'Aug 08', price: 199 },
          { date: 'Aug 15', price: 189 },
          { date: 'Aug 22', price: 179 },
          { date: 'Sep 01', price: 169 }
        ]
      }
    ];

    let specs: Record<string, string> = {
      'Condition': 'New & Certified Pre-Owned',
      'Visual Match': 'High Confidence (99.1%)',
      'Marketplaces': '8 Platforms Indexed',
      'Best Arbitrage': 'Walmart / Amazon'
    };

    let priceAnalytics = {
      lowestPrice: 199.99,
      highestPrice: 289.99,
      averagePrice: 249.00,
      allTimeLow: 189.99,
      priceTrend: 'dropping' as const,
      savingsPotential: 90.00
    };

    if (searchResult && searchResult.products && searchResult.products.length > 0) {
      name = searchResult.query || name;
      brand = name.split(' ')[0] || brand;

      const platformColors: Record<string, string> = {
        amazon: '#ff9900',
        flipkart: '#2874f0',
        ajio: '#2c4152',
        walmart: '#0071dc',
        'best buy': '#0046be',
        ebay: '#e53238',
      };

      deals = searchResult.products.map((p, idx) => {
        const rawPlatform = (p.platform || 'store').toLowerCase();
        const displayPlatform = rawPlatform.charAt(0).toUpperCase() + rawPlatform.slice(1);
        const price = Number(p.price) || 0;
        const originalPrice = Number(p.originalPrice) || Math.round(price * 1.25);

        return {
          id: `deal-${searchResult.searchId || Date.now()}-${idx}`,
          platform: displayPlatform as any,
          logoColor: platformColors[rawPlatform] || '#06b6d4',
          sellerName: p.title.length > 40 ? p.title.slice(0, 38) + '...' : p.title,
          sellerRating: Number(p.rating) || 4.4,
          sellerReviewsCount: Math.floor(1200 + Math.random() * 8800),
          price: price,
          originalPrice: originalPrice,
          currency: 'INR',
          inStock: p.inStock ?? true,
          shipping: {
            type: 'Express Delivery' as const,
            cost: 0,
            estimatedDays: '2-3 Business Days'
          },
          condition: 'Brand New' as const,
          returnPolicy: '7-10 Days Replacement/Return',
          dealTag: idx === 0 ? ('Lowest Price' as const) : idx === 1 ? ('Best Value' as const) : undefined,
          couponCode: idx === 0 ? 'SNAP10OFF' : undefined,
          couponDiscount: idx === 0 ? 'Verified Instant Coupon' : undefined,
          productUrl: p.productUrl || '#',
          priceHistory: [
            { date: '15 Days Ago', price: Math.round(price * 1.08) },
            { date: '7 Days Ago', price: Math.round(price * 1.04) },
            { date: 'Today', price: price }
          ]
        };
      });

      const sorted = [...deals].sort((a, b) => a.price - b.price);
      const lowest = sorted[0]?.price || 0;
      const highest = sorted[sorted.length - 1]?.price || 0;
      const avg = Math.round(deals.reduce((acc, d) => acc + d.price, 0) / deals.length);

      priceAnalytics = {
        lowestPrice: lowest,
        highestPrice: highest,
        averagePrice: avg,
        allTimeLow: lowest,
        priceTrend: 'dropping',
        savingsPotential: Math.max(0, highest - lowest)
      };

      const uniquePlatforms = [...new Set(searchResult.products.map((p) => p.platform.toUpperCase()))].join(', ');
      specs = {
        'Search Query': searchResult.query,
        'Found Listings': `${searchResult.totalFound || deals.length} Live Items`,
        'Active Marketplaces': uniquePlatforms,
        'Session ID': (searchResult.searchId || '').slice(0, 13) || 'AI-VISION-MATCH'
      };
    }

    const customProduct: ProductPreset = {
      id: searchResult?.searchId || `custom-${Date.now()}`,
      name,
      tagline: searchResult?.totalFound
        ? `Optical Vision isolated SKU. Crawled ${searchResult.totalFound} real-time listings across Amazon, Flipkart, Ajio & more.`
        : 'Deep visual embeddings isolated. Cross-platform prices retrieved from live APIs.',
      category: 'Electronics',
      brand,
      model: name,
      sku: 'SKU-' + (searchResult?.searchId ? searchResult.searchId.slice(0, 8).toUpperCase() : Math.floor(100000 + Math.random() * 900000)),
      confidenceScore: 99.4,
      imageUrl: imageUrl,
      specs,
      priceAnalytics,
      deals,
      alternatives: [
        {
          id: 'alt-custom-1',
          title: 'Comparable Pro Grade Alternative Model',
          category: 'Electronics',
          brand: 'ProSeries',
          imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
          platform: 'Amazon',
          price: 189.00,
          originalPrice: 239.00,
          badge: 'Best Value',
          similarityScore: 93,
          keyDifference: 'Top rated equivalent with extended battery and compact form factor',
          rating: 4.8,
          reviewsCount: 6500,
          productUrl: 'https://www.amazon.com'
        }
      ]
    };

    setCurrentProduct(customProduct);
    triggerAgentPipeline(customProduct);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050714] flex items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Initializing SnapPrice Matrix...</span>
        </div>
      </div>
    );
  }

  if (showLoader) {
    return (
      <SnapPriceLoader
        brandTitle="SnapPrice"
        onComplete={() => {
          setShowLoader(false);
          if (!isAuthenticated()) {
            router.push('/login');
          }
        }}
      />
    );
  }

  return (
    <main className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* 1. Motion Graphics Canvas Background */}
      <MotionBackground />

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeCurrency={activeCurrency}
        onCurrencyChange={setActiveCurrency}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
        isScanning={isScanning}
        onReplayLoader={() => setShowLoader(true)}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-2">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.2)] animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AGENTIC VISION // CROSS-PLATFORM ARBITRAGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Upload Any Product Image. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Scrape All Stores Instantly.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our multi-agent AI vision swarm isolates product features, crawls live pricing across Amazon, Walmart, Best Buy, eBay & more, reveals hidden coupons, and recommends high-value alternatives.
          </p>

          {/* Quick Metrics Badges */}
          {/* <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2 text-xs font-mono text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>&lt; 500ms Optical Recognition</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>8 Connected Marketplaces</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Seller Verified</span>
            </div>
          </div> */}
        </div>

        {/* 3. Visual Image Scanner & Product Identifier */}
        <ImageScanner
          currentProduct={currentProduct}
          onSelectPreset={handleSelectPreset}
          onCustomImageUpload={handleCustomImageUpload}
          isScanning={isScanning}
          onTriggerScan={() => triggerAgentPipeline(currentProduct)}
        />

        {/* 4. Live Multi-Agent Swarm Pipeline */}
        {/* <AgentPipeline
          currentStage={agentStage}
          isComplete={isAgentComplete}
          productName={currentProduct.name}
        /> */}

        {/* 5. Live Multi-Platform Price Comparison Board */}
        <PriceComparisonBoard
          product={currentProduct}
          activeCurrency={activeCurrency}
        />

        {/* 6. Cross-Platform Alternative & Similar Recommendations */}
        {/* <AlternativesSection
          product={currentProduct}
          activeCurrency={activeCurrency}
        /> */}
      </div>

      {/* 7. Interactive Contextual AI Chatbot */}
      <AIChatBot
        product={currentProduct}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* 8. Price Alert Subscription Modal */}
      {/* <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        product={currentProduct}
        activeCurrency={activeCurrency}
      /> */}

      {/* Footer */}
      <footer className="relative z-10 border-t border-indigo-500/15 backdrop-blur-xl bg-[#070b20]/80 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">SnapPrice AGENTIC AI</span>
            <span>• Next-Gen Visual Commerce Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Amazon</span>
            <span>•</span>
            <span>Walmart</span>
            <span>•</span>
            <span>Best Buy</span>
            <span>•</span>
            <span>eBay</span>
            <span>•</span>
            <span>B&H Photo</span>
            <span>•</span>
            <span>AliExpress</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
