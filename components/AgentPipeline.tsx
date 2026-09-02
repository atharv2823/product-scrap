'use client';

import React, { useState } from 'react';
import { ScanEye, Globe, TrendingDown, ShieldCheck, Sparkles, CheckCircle, Loader2, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { AI_AGENT_STAGES } from '../lib/mockData';

interface AgentPipelineProps {
  currentStage: number; // 1 to 5
  isComplete: boolean;
  productName: string;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  ScanEye: <ScanEye className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  TrendingDown: <TrendingDown className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />
};

export default function AgentPipeline({
  currentStage,
  isComplete,
  productName
}: AgentPipelineProps) {
  const [showLogs, setShowLogs] = useState(false);

  const logs = [
    { time: '0.05s', agent: 'Vision Agent', text: `Extracted visual contours. Identified: "${productName.slice(0, 32)}..." with 98.6% confidence.` },
    { time: '0.22s', agent: 'Crawler Agent', text: 'Queried Amazon, Best Buy, Walmart, eBay, B&H Photo, Target & AliExpress API endpoints.' },
    { time: '0.48s', agent: 'Arbitrage Engine', text: 'Calculated baseline $71.99 price spread across retailers with coupon verification.' },
    { time: '0.70s', agent: 'Trust Guard', text: 'Audited 8 sellers, verified return policies, authentic OEM warranties & shipping tiers.' },
    { time: '0.95s', agent: 'Alternative Recommender', text: 'Identified 3 high-similarity alternatives & refurbished deals with top rating ratios.' },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#090f2b]/70 border border-indigo-500/20 backdrop-blur-xl p-4 sm:p-6 mb-8 shadow-[0_0_30px_rgba(30,27,75,0.3)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'} inline-block`} />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
            Autonomous Agentic Pipeline
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {isComplete ? '• All 5 Agents Finished (420ms)' : `• Running Stage ${currentStage}/5...`}
          </span>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition flex items-center gap-1 self-start sm:self-auto"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showLogs ? 'Hide Agent Telemetry' : 'View Agent Telemetry Logs'}</span>
          {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* 5-Step Stage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {AI_AGENT_STAGES.map((stage) => {
          const isPast = stage.id < currentStage || isComplete;
          const isCurrent = stage.id === currentStage && !isComplete;

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl p-3 border transition-all duration-300 flex flex-col justify-between ${
                isPast
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                  : 'bg-[#060a1e]/50 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-1.5 rounded-lg ${isPast ? 'bg-emerald-500/20 text-emerald-400' : isCurrent ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                  {ICONS_MAP[stage.icon]}
                </span>
                
                {isPast ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">0{stage.id}</span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold leading-tight mb-0.5 text-white">
                  {stage.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2">
                  {stage.description}
                </p>
              </div>

              {/* Glowing Bottom Status Bar */}
              <div className="mt-2.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isPast
                      ? 'w-full bg-emerald-400'
                      : isCurrent
                      ? 'w-3/4 bg-cyan-400 animate-pulse'
                      : 'w-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Agent Telemetry Logs Terminal */}
      {showLogs && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#040714] border border-cyan-500/30 font-mono text-[11px] text-slate-300 space-y-1.5 animate-fadeIn">
          <div className="text-xs text-cyan-400 pb-1 border-b border-cyan-900/50 flex items-center justify-between">
            <span>[AGENT_SWARM_COORDINATOR] Real-time Execution Feed:</span>
            <span className="text-[10px] text-slate-500">Protocol v2.5 / JSON-RPC</span>
          </div>
          {logs.slice(0, isComplete ? 5 : currentStage).map((l, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-500">[{l.time}]</span>
              <span className="text-cyan-300 font-semibold">{l.agent}:</span>
              <span className="text-slate-300">{l.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
