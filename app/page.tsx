'use client';

import React, { useState, useEffect } from 'react';
import MotionBackground from '../components/MotionBackground';
import Navbar from '../components/Navbar';
import ImageScanner from '../components/ImageScanner';
import AgentPipeline from '../components/AgentPipeline';
import PriceComparisonBoard from '../components/PriceComparisonBoard';
import AlternativesSection from '../components/AlternativesSection';
import AIChatBot from '../components/AIChatBot';
import PriceAlertModal from '../components/PriceAlertModal';
import { PRODUCT_PRESETS, ProductPreset } from '../lib/mockData';
import { soundFX } from '../components/AudioFX';
import { Sparkles, Shield, Cpu, Zap, ArrowRight, Layers, Bot } from 'lucide-react';

export default function Home() {
  const [currentProduct, setCurrentProduct] = useState<ProductPreset>(PRODUCT_PRESETS[0]);
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  // Multi-agent execution simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [agentStage, setAgentStage] = useState(5);
  const [isAgentComplete, setIsAgentComplete] = useState(true);

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

  const handleCustomImageUpload = (imageUrl: string, customName?: string) => {
    // Generate a new dynamic product preset for the uploaded custom image
    const customProduct: ProductPreset = {
      id: `custom-${Date.now()}`,
      name: customName || 'Custom Product Detected via Vision AI',
      tagline: 'Deep visual embeddings isolated. Cross-platform prices retrieved from live APIs.',
      category: 'Electronics',
      brand: 'Identified Brand',
      model: 'Model AI-X900',
      sku: 'SKU-VIS-' + Math.floor(100000 + Math.random() * 900000),
      confidenceScore: 99.1,
      imageUrl: imageUrl,
      specs: {
        'Condition': 'New & Certified Pre-Owned',
        'Visual Match': 'High Confidence (99.1%)',
        'Marketplaces': '8 Platforms Indexed',
        'Best Arbitrage': 'Walmart / Amazon'
      },
      priceAnalytics: {
        lowestPrice: 199.99,
        highestPrice: 289.99,
        averagePrice: 249.00,
        allTimeLow: 189.99,
        priceTrend: 'dropping',
        savingsPotential: 90.00
      },
      deals: [
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
      ],
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
          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2 text-xs font-mono text-slate-400 flex-wrap">
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
          </div>
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
        <AgentPipeline
          currentStage={agentStage}
          isComplete={isAgentComplete}
          productName={currentProduct.name}
        />

        {/* 5. Live Multi-Platform Price Comparison Board */}
        <PriceComparisonBoard
          product={currentProduct}
          activeCurrency={activeCurrency}
        />

        {/* 6. Cross-Platform Alternative & Similar Recommendations */}
        <AlternativesSection
          product={currentProduct}
          activeCurrency={activeCurrency}
        />
      </div>

      {/* 7. Interactive Contextual AI Chatbot */}
      <AIChatBot
        product={currentProduct}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* 8. Price Alert Subscription Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        product={currentProduct}
        activeCurrency={activeCurrency}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-indigo-500/15 backdrop-blur-xl bg-[#070b20]/80 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">PRICESYNC AGENTIC AI</span>
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
