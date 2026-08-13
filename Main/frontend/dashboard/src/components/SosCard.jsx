import React from 'react';
import { AlertTriangle, Clock, MapPin, User, Activity, CheckCircle, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

export default function SosCard({ report, onSelect, onStatusChange, onOverridePriority }) {
  const { _id, priority, reasoning, recommendedAction, dispatchStatus, isManDown, victimId, sosId, createdAt } = report;

  const victimName = victimId?.name || 'Anonymous Victim';
  const victimAge = victimId?.age ? `${victimId.age} yrs` : 'Unknown age';
  const location = victimId?.locationContext || 'Unknown Location';
  const rawText = sosId?.rawText || 'No distress text available.';
  const nodeId = sosId?.nodeId || 'Node ?';
  const seqId = sosId?.seqId || 'SEQ_???';

  // Format time ago
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    return `${Math.floor(diffSec / 3600)}h ago`;
  };

  // Styles based on priority
  const priorityStyles = {
    RED: {
      border: 'border-red-600/80 hover:border-red-500',
      bg: 'bg-slate-900/90',
      badgeBg: 'bg-red-950 border-red-700 text-red-400',
      glow: 'card-pulse-red',
      indicator: 'bg-red-500',
    },
    YELLOW: {
      border: 'border-amber-600/60 hover:border-amber-500',
      bg: 'bg-slate-900/90',
      badgeBg: 'bg-amber-950 border-amber-700 text-amber-400',
      glow: 'shadow-lg shadow-amber-950/20',
      indicator: 'bg-amber-500',
    },
    GREEN: {
      border: 'border-emerald-600/60 hover:border-emerald-500',
      bg: 'bg-slate-900/90',
      badgeBg: 'bg-emerald-950 border-emerald-700 text-emerald-400',
      glow: 'shadow-lg shadow-emerald-950/20',
      indicator: 'bg-emerald-500',
    },
    UNCLASSIFIED: {
      border: 'border-purple-600/60 hover:border-purple-500',
      bg: 'bg-slate-900/90',
      badgeBg: 'bg-purple-950 border-purple-700 text-purple-400',
      glow: 'shadow-lg shadow-purple-950/20',
      indicator: 'bg-purple-500',
    },
  };

  const currentStyle = priorityStyles[priority] || priorityStyles.UNCLASSIFIED;

  return (
    <div
      className={`relative rounded-xl border ${currentStyle.border} ${currentStyle.bg} ${currentStyle.glow} p-4 transition-all duration-200 hover:-translate-y-0.5`}
    >
      {/* Top Bar: Priority Badge + Man Down Flag + Time */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Priority Pill */}
          <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${currentStyle.badgeBg}`}>
            ● {priority || 'UNCLASSIFIED'}
          </span>

          {/* Man Down Badge */}
          {isManDown && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold bg-rose-900/80 border border-rose-600 text-rose-200 rounded-md animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              MAN DOWN DETECTED
            </span>
          )}

          {/* Sequence ID */}
          <span className="text-[11px] font-mono text-slate-500">#{seqId}</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{timeAgo(createdAt)}</span>
        </div>
      </div>

      {/* Main Body: Victim Info & Raw Message */}
      <div className="mb-3 cursor-pointer" onClick={() => onSelect(report)}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              {victimName} <span className="text-xs font-normal text-slate-400">({victimAge})</span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {location}
              <span className="text-slate-600">•</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Node {nodeId}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(report);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* SOS Raw Text Snippet */}
        <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs font-mono text-slate-300 italic">
          "{rawText}"
        </div>
      </div>

      {/* AI Reasoning & Action */}
      <div className="mb-4 text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
        <p className="text-slate-300 font-sans">
          <strong className="text-slate-400 font-mono">AI Assessment:</strong> {reasoning || 'Processing triage analysis...'}
        </p>
        {recommendedAction && (
          <p className="mt-1.5 text-emerald-400 font-mono">
            <strong>Action:</strong> {recommendedAction}
          </p>
        )}
      </div>

      {/* Bottom Footer: Dispatch Controls & Override */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
        {/* Dispatch Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">STATUS:</span>
          <select
            value={dispatchStatus || 'PENDING'}
            onChange={(e) => onStatusChange(_id, e.target.value)}
            className={`text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors ${
              dispatchStatus === 'RESCUED'
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : dispatchStatus === 'DISPATCHED'
                ? 'bg-blue-950 border-blue-700 text-blue-300'
                : 'bg-slate-950 border-slate-700 text-slate-300'
            }`}
          >
            <option value="PENDING">🔴 PENDING</option>
            <option value="DISPATCHED">🚀 DISPATCHED</option>
            <option value="RESCUED">✅ RESCUED</option>
          </select>
        </div>

        {/* Commander Priority Override Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Override:</span>
          <button
            onClick={() => onOverridePriority(_id, 'RED')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
              priority === 'RED'
                ? 'bg-red-600 border-red-500 text-white font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-red-400'
            }`}
          >
            RED
          </button>
          <button
            onClick={() => onOverridePriority(_id, 'YELLOW')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
              priority === 'YELLOW'
                ? 'bg-amber-600 border-amber-500 text-white font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-amber-400'
            }`}
          >
            YEL
          </button>
          <button
            onClick={() => onOverridePriority(_id, 'GREEN')}
            className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
              priority === 'GREEN'
                ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-emerald-400'
            }`}
          >
            GRN
          </button>
        </div>
      </div>
    </div>
  );
}
