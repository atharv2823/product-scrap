'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, Minimize2, Maximize2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductPreset, SAMPLE_AI_QUERIES } from '../lib/mockData';
import { soundFX } from './AudioFX';

interface AIChatBotProps {
  product: ProductPreset;
  onOpenAlertModal: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'alert' | 'view_deal';
  };
}

export default function AIChatBot({ product, onOpenAlertModal }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I'm your AI Commerce Agent. I've analyzed "${product.name}" across 8 online marketplaces. Lowest price found is $${product.priceAnalytics.lowestPrice.toFixed(2)} at Walmart. How can I help you find deals or alternatives?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Update initial message when product changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${product.id}`,
        sender: 'agent',
        text: `Active context updated to "${product.name}". I've indexed live pricing from Amazon, Walmart, Best Buy, eBay, and B&H Photo. What would you like to know?`,
        timestamp: 'Just now'
      }
    ]);
  }, [product]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    soundFX.playClick();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Response generation based on context
    setTimeout(() => {
      soundFX.playAgentStep();
      setIsTyping(false);

      let responseText = '';
      let action: { label: string; actionType: 'alert' | 'view_deal' } | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('lowest') || lower.includes('cheapest') || lower.includes('price')) {
        const lowestDeal = product.deals.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), product.deals[0]);
        responseText = `The lowest price for "${product.name}" is currently on **${lowestDeal.platform}** at **$${lowestDeal.price.toFixed(2)}** (saving $${(lowestDeal.originalPrice - lowestDeal.price).toFixed(2)} off MSRP). ${lowestDeal.couponCode ? `Make sure to use coupon code **${lowestDeal.couponCode}** for extra savings!` : ''}`;
      } else if (lower.includes('refurbish') || lower.includes('used') || lower.includes('open box')) {
        const refurb = product.deals.find(d => d.condition.includes('Refurbished') || d.condition.includes('Open Box'));
        if (refurb) {
          responseText = `Found a Certified Refurbished deal on **${refurb.platform}** for **$${refurb.price.toFixed(2)}**. It includes full merchant verification and ${refurb.returnPolicy}.`;
        } else {
          responseText = `Currently all scraped listings for this model are Brand New condition starting at $${product.priceAnalytics.lowestPrice.toFixed(2)}.`;
        }
      } else if (lower.includes('fastest') || lower.includes('shipping') || lower.includes('delivery')) {
        const fastDeal = product.deals.find(d => d.shipping.type.includes('Prime') || d.shipping.type.includes('1-Day')) || product.deals[0];
        responseText = `The fastest delivery is offered by **${fastDeal.platform}** with **${fastDeal.shipping.type}** (${fastDeal.shipping.estimatedDays}) priced at $${fastDeal.price.toFixed(2)}.`;
      } else if (lower.includes('alert') || lower.includes('notify') || lower.includes('drop')) {
        responseText = `I can monitor all 8 retail platforms 24/7 and alert you the second the price drops below $${(product.priceAnalytics.lowestPrice * 0.95).toFixed(2)}. Would you like to activate the tracker?`;
        action = {
          label: 'Configure Price Alert',
          actionType: 'alert'
        };
      } else if (lower.includes('alternative') || lower.includes('similar') || lower.includes('cheaper')) {
        if (product.alternatives && product.alternatives.length > 0) {
          const topAlt = product.alternatives[0];
          responseText = `The top recommended alternative is the **${topAlt.title}** on **${topAlt.platform}** for **$${topAlt.price.toFixed(2)}**. Key advantage: ${topAlt.keyDifference}.`;
        } else {
          responseText = `I am continuously scanning cross-platform catalogs for high-similarity alternatives.`;
        }
      } else {
        responseText = `Based on my real-time scraper analysis for **${product.brand} ${product.model}**, price trends are currently **${product.priceAnalytics.priceTrend}** with an average market value of $${product.priceAnalytics.averagePrice.toFixed(2)}. You can compare warranty, shipping, and coupons across all 6 verified retailers listed above.`;
      }

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: responseText,
        timestamp: 'Just now',
        suggestedAction: action
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 900);
  };

  return (
    <>
      {/* Floating Toggle Button (When Closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce-subtle">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsOpen(true);
            }}
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 border border-cyan-300/40 hover:scale-105"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            </div>
            <span>Ask AI Price Agent</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 font-mono">
              LIVE
            </span>
          </button>
        </div>
      )}

      {/* Expanded Chat Drawer / Widget */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] max-h-[85vh] rounded-3xl backdrop-blur-2xl bg-[#090f2d]/95 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.35)] flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0d163d] via-[#101b4b] to-[#14123b] border-b border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white font-sans">
                    ScoutAI Commerce Copilot
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300">
                  Target: {product.brand} ({product.category})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-[#060a20]/80 border-b border-indigo-500/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SAMPLE_AI_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-[11px] text-cyan-200 hover:text-white transition flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                      : 'bg-[#060c24] border border-indigo-500/30 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  
                  {msg.suggestedAction && (
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        if (msg.suggestedAction?.actionType === 'alert') {
                          onOpenAlertModal();
                        }
                      }}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#060c24] border border-indigo-500/30 max-w-[100px] text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#060a22] border-t border-indigo-500/20 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about prices, warranty, shipping..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#091030] border border-indigo-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
