'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Scan, Sparkles, Image as ImageIcon, CheckCircle2, RefreshCw, Cpu, Layers, Tag, Eye } from 'lucide-react';
import { PRODUCT_PRESETS, ProductPreset } from '../lib/mockData';
import { soundFX } from './AudioFX';

interface ImageScannerProps {
  currentProduct: ProductPreset;
  onSelectPreset: (preset: ProductPreset) => void;
  onCustomImageUpload: (imageUrl: string, customName?: string) => void;
  isScanning: boolean;
  onTriggerScan: () => void;
}

export default function ImageScanner({
  currentProduct,
  onSelectPreset,
  onCustomImageUpload,
  isScanning,
  onTriggerScan,
}: ImageScannerProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        soundFX.playScanBeep();
        onCustomImageUpload(event.target.result as string, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    soundFX.playScanBeep();
    onCustomImageUpload(customUrlInput.trim(), 'Custom Image Input');
    setCustomUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="w-full relative rounded-3xl backdrop-blur-2xl bg-[#090f2b]/80 border border-cyan-500/25 p-5 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)] overflow-hidden">
      
      {/* Decorative Corner Cyber Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Scan className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
            <span>AI Optical Vision Scanner & Product Identifier</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Upload or Select Product Image
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Agentic computer vision detects SKU, brand, model, and initiates multi-platform scrapers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              soundFX.playClick();
              setShowUrlInput(!showUrlInput);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{showUrlInput ? 'Hide URL' : 'Paste Image URL'}</span>
          </button>

          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="mb-6 flex gap-2">
          <input
            type="url"
            placeholder="Paste public image link (e.g. https://.../product.jpg)"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            className="flex-1 bg-[#060b20] border border-cyan-500/40 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 transition"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
          >
            Load & Scan
          </button>
        </form>
      )}

      {/* Main Scanner Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left / Center: Interactive Image Frame with Holographic Laser HUD */}
        <div className="lg:col-span-6 relative">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!isScanning) onTriggerScan();
            }}
            className={`group relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01] shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                : 'border-cyan-500/30 bg-[#05081c]/90 hover:border-cyan-400/60'
            }`}
          >
            {/* Background Image Display */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className={`w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] transition-transform duration-700 group-hover:scale-105 ${
                  isScanning ? 'brightness-110 saturate-125' : ''
                }`}
              />
            </div>

            {/* Target Reticle Crosshair HUD */}
            <div className="absolute inset-4 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
              
              {/* Centered crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-400/40 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              </div>

              {/* Bounding Box Simulation */}
              <div className="absolute inset-6 border border-dashed border-cyan-400/30 rounded-xl pointer-events-none">
                <span className="absolute -top-2.5 left-4 bg-cyan-950 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-400/40">
                  OBJECT DETECTED: {currentProduct.category.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Animated Laser Scanning Beam */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff,0_0_40px_#00f0ff] animate-[scan_2s_ease-in-out_infinite] z-20">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-cyan-500 text-[9px] font-mono font-bold text-slate-950 rounded-full shadow-lg">
                  SCANNING MODEL FEATURES...
                </div>
              </div>
            )}

            {/* Status Floating Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <div className="px-3 py-1 rounded-lg bg-[#070d24]/90 border border-cyan-400/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400 animate-spin" />
                <span>AI Confidence: {currentProduct.confidenceScore}%</span>
              </div>
              
              <div className="px-3 py-1 rounded-lg bg-indigo-950/90 border border-indigo-400/30 text-[11px] font-mono text-indigo-300 backdrop-blur-md">
                <span>{currentProduct.brand}</span>
              </div>
            </div>

            {/* Click to re-scan hint */}
            <div className="absolute inset-0 bg-cyan-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
              <span className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-400 text-cyan-300 text-xs font-semibold tracking-wide flex items-center gap-2 shadow-2xl">
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Agents Scraping Live...' : 'Click to Re-Scan Image'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Extracted Intelligence & Attributes Card */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                {currentProduct.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
                SKU: {currentProduct.sku}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Match
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {currentProduct.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {currentProduct.tagline}
            </p>
          </div>

          {/* Extracted Hardware / Product Specs Matrix */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-[#060a22]/80 border border-indigo-500/20">
            {Object.entries(currentProduct.specs).slice(0, 4).map(([key, val]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {key}
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate" title={val}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Price Arbitrage Snapshot */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900/60 border border-cyan-500/30">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Lowest Cross-Platform Price
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight flex items-baseline gap-2">
                ${currentProduct.priceAnalytics.lowestPrice.toFixed(2)}
                <span className="text-xs font-normal text-slate-400 line-through">
                  ${currentProduct.priceAnalytics.highestPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-300">
                Max Arbitrage Savings
              </div>
              <div className="text-base font-bold text-cyan-300 font-mono">
                +${currentProduct.priceAnalytics.savingsPotential.toFixed(2)} OFF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Showcase Tray */}
      <div className="mt-7 pt-5 border-t border-indigo-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Test Presets (1-Click Switch):</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Switch images to test computer vision & scraping
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {PRODUCT_PRESETS.map((preset) => {
            const isSelected = preset.id === currentProduct.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectPreset(preset);
                }}
                className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                    : 'border-slate-800 bg-[#060a20]/60 hover:border-slate-600 hover:bg-[#0b1236]'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-black/40 mb-1.5">
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-200 text-center truncate w-full">
                  {preset.brand}
                </span>
                <span className="text-[9px] font-mono text-emerald-400">
                  ${preset.priceAnalytics.lowestPrice.toFixed(0)}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#090f2b]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
