'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  X,
  History,
  Camera,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { soundFX } from './AudioFX';

export interface UserSearchItem {
  id: string;
  userId: string;
  searchType: 'image' | 'text' | string;
  query: string;
  createdAt: string;
}

export interface SearchHistoryPagination {
  count: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  total: number;
}

export interface SearchHistoryResponse {
  searches: UserSearchItem[];
  pagination: SearchHistoryPagination;
}

export interface HistorySearchResult {
  price: number;
  title: string;
  inStock: boolean;
  imageUrl?: string;
  platform: string;
  productUrl: string;
  originalPrice?: number;
}

export interface HistorySearchDetail {
  id: string;
  userId: string;
  searchType: string;
  query: string;
  userFeedback?: string;
  analysis?: {
    brand?: string;
    color?: string;
    category?: string;
    productName?: string;
    searchQuery?: string;
  };
  totalFound: number;
  results: HistorySearchResult[];
  createdAt: string;
}

interface SearchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSearch?: (detail: HistorySearchDetail) => void;
}

export default function SearchHistoryModal({ isOpen, onClose, onSelectSearch }: SearchHistoryModalProps) {
  const [searches, setSearches] = useState<UserSearchItem[]>([]);
  const [pagination, setPagination] = useState<SearchHistoryPagination>({
    count: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'text'>('all');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchHistory = useCallback(
    async (pageToFetch: number, limitToFetch: number) => {
      setIsLoading(true);
      setError(null);

      const token =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
          : null;

      if (!token) {
        setError('Authentication token not found. Please log in to view search history.');
        setIsLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
        const offset = (pageToFetch - 1) * limitToFetch;

        const response = await axios.get<SearchHistoryResponse>(
          `${baseUrl}/product-search/user`,
          {
            params: {
              limit: limitToFetch,
              page: pageToFetch,
              offset: offset,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.searches)) {
          setSearches(response.data.searches);
          const totalItems = response.data.pagination?.total ?? response.data.searches.length;
          const calculatedTotalPages =
            response.data.pagination?.totalPages ||
            Math.max(1, Math.ceil(totalItems / limitToFetch));

          setPagination({
            count: response.data.pagination?.count ?? response.data.searches.length,
            page: response.data.pagination?.page ?? pageToFetch,
            limit: response.data.pagination?.limit ?? limitToFetch,
            totalPages: calculatedTotalPages,
            total: totalItems,
          });
          setCurrentPage(pageToFetch);
        } else {
          setSearches([]);
          setPagination({ count: 0, page: 1, limit: limitToFetch, totalPages: 1, total: 0 });
        }
      } catch (err: unknown) {
        console.error('Error fetching user search history:', err);
        if (axios.isAxiosError(err)) {
          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            (err.response?.status === 401
              ? 'Session expired. Please log in again.'
              : 'Failed to retrieve search history from server.');
          setError(Array.isArray(msg) ? msg.join(', ') : msg);
        } else {
          setError('Failed to connect to search history server.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      fetchHistory(1, pageSize);
    }
  }, [isOpen, pageSize, fetchHistory]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination.totalPages && newPage > pagination.totalPages) || isLoading) {
      return;
    }
    soundFX.playClick();
    fetchHistory(newPage, pageSize);
  };

  const handleLoadHistoryDetail = async (id: string) => {
    const token =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
        : null;

    if (!token) {
      setError('Please log in to load search history onto the page.');
      return;
    }

    try {
      setLoadingDetailId(id);
      soundFX.playClick();

      const response = await axios.get<HistorySearchDetail>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product-search/history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.id) {
        soundFX.playDealFound();
        // 1. Invoke callback prop if provided
        if (onSelectSearch) {
          onSelectSearch(response.data);
        }
        // 2. Dispatch global custom event for main dashboard
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('snapprice_load_history', { detail: response.data })
          );
        }
        // Close modal
        onClose();
      } else {
        throw new Error('Search history details not found.');
      }
    } catch (err: unknown) {
      console.error('Error fetching search history detail:', err);
      soundFX.playClick();
      let errorMsg = 'Failed to load details for this search.';
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string): { formatted: string; relative: string } => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { formatted: dateStr, relative: '' };

      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let relative = '';
      if (diffMins < 1) relative = 'Just now';
      else if (diffMins < 60) relative = `${diffMins}m ago`;
      else if (diffHours < 24) relative = `${diffHours}h ago`;
      else if (diffDays === 1) relative = 'Yesterday';
      else if (diffDays < 7) relative = `${diffDays}d ago`;

      const formatted = d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return { formatted, relative };
    } catch {
      return { formatted: dateStr, relative: '' };
    }
  };

  const filteredSearches = searches.filter((item) => {
    if (filterType === 'all') return true;
    return item.searchType?.toLowerCase() === filterType;
  });

  const totalPages = pagination.totalPages || 1;

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFX.playClick();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl backdrop-blur-2xl bg-[#080d27]/98 border border-cyan-500/30 p-5 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden my-auto animate-scaleUp">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer z-10"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-indigo-500/20 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0">
            <History className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Search History
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {pagination.total} Total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Review all visual optical scans and text inquiries indexed across marketplaces.
            </p>
          </div>
        </div>

        {/* Toolbar: Filters & Refresh */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center bg-[#05091e] p-1 rounded-xl border border-indigo-500/20 text-xs">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setFilterType('all');
              }}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setFilterType('image');
              }}
              className={`px-3 py-1 rounded-lg transition font-medium flex items-center gap-1.5 ${
                filterType === 'image'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>Image Scans</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setFilterType('text');
              }}
              className={`px-3 py-1 rounded-lg transition font-medium flex items-center gap-1.5 ${
                filterType === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3 text-indigo-400" />
              <span>Text Queries</span>
            </button>
          </div>

          {/* Right: Items per page & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="text-[11px] font-mono hidden sm:inline">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  soundFX.playClick();
                }}
                className="bg-[#05091e] border border-indigo-500/30 text-slate-200 text-xs rounded-lg px-2 py-1 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                fetchHistory(currentPage, pageSize);
              }}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-[#05091e] hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-indigo-500/30 transition disabled:opacity-50 cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-2.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-mono text-slate-400">
                Fetching search logs from vision database...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-center space-y-3 my-4">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-xs sm:text-sm text-rose-300 font-medium">{error}</p>
              <button
                type="button"
                onClick={() => fetchHistory(currentPage, pageSize)}
                className="px-4 py-1.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-200 text-xs font-semibold transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredSearches.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-[#05091e]/60 border border-indigo-500/15 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No search records found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filterType === 'all'
                  ? 'Upload an image or run a product inquiry to see your activity timeline here.'
                  : `No ${filterType} searches match the current filter.`}
              </p>
            </div>
          ) : (
            filteredSearches.map((item) => {
              const isImage = item.searchType?.toLowerCase() === 'image';
              const { formatted, relative } = formatDate(item.createdAt);
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="group relative p-3.5 sm:p-4 rounded-2xl bg-[#060b22]/90 hover:bg-[#0b143c] border border-indigo-500/20 hover:border-cyan-400/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  {/* Left: Type Badge & Query Title */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isImage ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-cyan-400" />
                          <span>Image Vision</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                          <Search className="w-3 h-3 text-indigo-400" />
                          <span>Text Search</span>
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatted}</span>
                        {relative && (
                          <span className="text-slate-400 font-medium">({relative})</span>
                        )}
                      </span>
                    </div>

                    <h4
                      className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2"
                      title={item.query}
                    >
                      {item.query}
                    </h4>

                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                      <span className="truncate max-w-[200px] sm:max-w-none">
                        UUID: <span className="text-slate-400">{item.id}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Actions: View on Page & Copy button */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadHistoryDetail(item.id)}
                      disabled={loadingDetailId === item.id}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer disabled:cursor-not-allowed"
                      title="Load this search and live deals onto the main page"
                    >
                      {loadingDetailId === item.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>View on Page</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.query, item.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-[#05091e] hover:bg-slate-800 text-slate-300 hover:text-white border-indigo-500/30 hover:border-cyan-400/40'
                      }`}
                      title="Copy search query"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
                          <span className="hidden sm:inline">Copy Query</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer: Pagination Bar */}
        <div className="mt-4 pt-3.5 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Record Count */}
          <div className="text-slate-400 font-mono text-[11px] text-center sm:text-left">
            Showing{' '}
            <span className="text-cyan-300 font-bold">
              {pagination.total > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>
            –
            <span className="text-cyan-300 font-bold">
              {Math.min(currentPage * pageSize, pagination.total)}
            </span>{' '}
            of <span className="text-white font-bold">{pagination.total}</span> searches
          </div>

          {/* Page Buttons Controls */}
          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="px-2.5 py-1.5 rounded-xl bg-[#05091e] border border-indigo-500/30 text-slate-300 hover:text-white hover:border-cyan-400 disabled:opacity-40 disabled:hover:border-indigo-500/30 disabled:hover:text-slate-300 transition flex items-center gap-1 cursor-pointer font-medium disabled:cursor-not-allowed text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Number Chips */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                .filter((p) => {
                  // Show first, last, and window around current page
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - currentPage) <= 1;
                })
                .map((p, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && p - prevPage > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="px-1 text-slate-500 font-mono text-xs select-none">
                          ...
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        disabled={isLoading}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                          p === currentPage
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-400'
                            : 'bg-[#05091e] hover:bg-slate-800 text-slate-300 hover:text-white border border-indigo-500/20'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="px-2.5 py-1.5 rounded-xl bg-[#05091e] border border-indigo-500/30 text-slate-300 hover:text-white hover:border-cyan-400 disabled:opacity-40 disabled:hover:border-indigo-500/30 disabled:hover:text-slate-300 transition flex items-center gap-1 cursor-pointer font-medium disabled:cursor-not-allowed text-xs"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
