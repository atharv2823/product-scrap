'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Bot, Send, Sparkles, X, MessageSquare, RefreshCw, AlertCircle, ShoppingCart } from 'lucide-react';
import { ProductPreset } from '../lib/mockData';
import { soundFX } from './AudioFX';

interface AIChatBotProps {
  product?: ProductPreset | null;
  onOpenAlertModal?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'alert' | 'login';
  };
}

const QUICK_SUGGESTIONS = [
  'Where can I find the best online deals today?',
  'Which store currently has the lowest prices?',
  'Compare prices between Amazon and Flipkart',
  'Are there any active discount coupons or sales?',
  'What are the best budget-friendly alternatives?',
  'Find top-rated products with the fastest delivery'
];

// Helper to safely render Markdown formatting into HTML
function renderFormattedMarkdown(text: string) {
  if (!text) return '';

  // 1. Basic HTML sanitization
  let sanitized = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Markdown Hyperlinks [label](url)
  sanitized = sanitized.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline font-semibold inline-flex items-center gap-1 cursor-pointer break-all">$1 ↗</a>'
  );

  // 3. Headings: ### Title or ## Title
  sanitized = sanitized.replace(/^###\s+(.*$)/gim, '<h4 class="font-bold text-white text-xs sm:text-sm mt-2 mb-1 tracking-tight">$1</h4>');
  sanitized = sanitized.replace(/^##\s+(.*$)/gim, '<h3 class="font-bold text-white text-sm sm:text-base mt-2.5 mb-1.5 tracking-tight">$1</h3>');

  // 4. Bold: **text**
  sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

  // 5. Italics: *text* or *(text)*
  sanitized = sanitized.replace(/\*([^*\n]+)\*/g, '<em class="text-slate-300 italic">$1</em>');

  // 6. Horizontal Rules: ---
  sanitized = sanitized.replace(/^---$/gim, '<hr class="my-2 border-indigo-500/25" />');

  // 7. Bullet items: * item or - item
  sanitized = sanitized.replace(
    /^\s*[\*\-]\s+(.*$)/gim,
    '<div class="flex items-start gap-1.5 my-0.5 ml-1"><span class="text-cyan-400 font-bold shrink-0 mt-0.5">•</span><span>$1</span></div>'
  );

  // 8. Newlines to linebreaks
  sanitized = sanitized.replace(/\n{2,}/g, '<div class="h-1.5"></div>');
  sanitized = sanitized.replace(/\n/g, '<br />');

  return sanitized;
}

export default function AIChatBot({ product, onOpenAlertModal }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: product?.name
        ? `Hello! I'm Snap AI. Ask me anything about **${product.name}**, or ask where to buy any product across online marketplaces!`
        : `Hello! I'm Snap AI. Ask me where to buy any product, check live store deals, or compare prices!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // When active product updates, inform user in chat without erasing previous history
  useEffect(() => {
    if (product?.name) {
      setMessages((prev) => [
        ...prev,
        {
          id: `context-${Date.now()}`,
          sender: 'agent',
          text: `Active context updated to **${product.name}**. What would you like to know about this item?`,
          timestamp: 'Just now'
        }
      ]);
    }
  }, [product?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

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

    try {
      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
          : null;

      if (!token) {
        soundFX.playClick();
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-no-auth-${Date.now()}`,
            sender: 'agent',
            text: 'Please log in to chat with Snap AI. You can sign in using your account to start asking product and shopping questions.',
            timestamp: 'Just now',
            suggestedAction: {
              label: 'Go to Login',
              actionType: 'login'
            }
          }
        ]);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

      const response = await axios.post<{
        success: boolean;
        id?: string;
        message?: string;
        answer?: string;
      }>(
        `${baseUrl}/chat`,
        { message: query },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      soundFX.playAgentStep();
      const botAnswer = response.data?.answer || response.data?.message || 'I processed your query.';

      const agentMsg: Message = {
        id: response.data?.id || `agent-${Date.now()}`,
        sender: 'agent',
        text: botAnswer,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: unknown) {
      console.error('Chat API Error:', err);
      soundFX.playClick();
      let errorResponse = 'Sorry, I was unable to connect to the AI service. Please try again.';

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorResponse = 'Your session has expired or is unauthorized. Please log in again to continue.';
        } else if (err.response?.data?.message) {
          errorResponse = Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : String(err.response.data.message);
        } else if (err.message) {
          errorResponse = `Connection error: ${err.message}. Please verify the backend server is active.`;
        }
      } else if (err instanceof Error) {
        errorResponse = err.message;
      }

      const agentErrorMsg: Message = {
        id: `agent-err-${Date.now()}`,
        sender: 'agent',
        text: errorResponse,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, agentErrorMsg]);
    } finally {
      setIsTyping(false);
    }
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
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 border border-cyan-300/40 hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            </div>
            <span>Ask Snap AI</span>
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
                    Snap AI
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 truncate max-w-[200px] block">
                  {product?.name ? `Target: ${product.name}` : 'Live Shopping Copilot'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-[#060a20]/80 border-b border-indigo-500/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_SUGGESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-[11px] text-cyan-200 hover:text-white transition flex-shrink-0 disabled:opacity-50 cursor-pointer"
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
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                      : 'bg-[#060c24] border border-indigo-500/30 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: renderFormattedMarkdown(msg.text) }}
                    className="space-y-1"
                  />
                  
                  {msg.suggestedAction && (
                    <div className="mt-2.5">
                      {msg.suggestedAction.actionType === 'login' ? (
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{msg.suggestedAction.label}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            if (msg.suggestedAction?.actionType === 'alert' && onOpenAlertModal) {
                              onOpenAlertModal();
                            }
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{msg.suggestedAction.label}</span>
                        </button>
                      )}
                    </div>
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
              placeholder="Ask about products, where to buy, prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-[#091030] border border-indigo-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 flex items-center justify-center font-bold transition shadow-md cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
