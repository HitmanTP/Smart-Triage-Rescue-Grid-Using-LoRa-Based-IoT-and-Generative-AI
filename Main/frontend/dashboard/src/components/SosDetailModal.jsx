import React from 'react';
import { X, User, MapPin, Cpu, Clock, AlertTriangle, ShieldCheck, Activity, Send } from 'lucide-react';

export default function SosDetailModal({ report, onClose, onStatusChange, onOverridePriority }) {
  if (!report) return null;

  const { _id, priority, reasoning, recommendedAction, dispatchStatus, isManDown, victimId, sosId, createdAt } = report;

  const victimName = victimId?.name || 'Anonymous Victim';
  const victimAge = victimId?.age ? `${victimId.age} years old` : 'Age unknown';
  const location = victimId?.locationContext || 'Unknown Location';
  const rawText = sosId?.rawText || 'No distress text available.';
  const nodeId = sosId?.nodeId || 'Unknown';
  const seqId = sosId?.seqId || 'SEQ_???';
  const hops = sosId?.hops || 1;
  const rssi = sosId?.rssi || -60;
  const msgType = sosId?.type || 'MANUAL';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border ${
                priority === 'RED'
                  ? 'bg-red-950 border-red-700 text-red-400'
                  : priority === 'YELLOW'
                  ? 'bg-amber-950 border-amber-700 text-amber-400'
                  : priority === 'GREEN'
                  ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                  : 'bg-purple-950 border-purple-700 text-purple-400'
              }`}
            >
              ● {priority || 'UNCLASSIFIED'} PRIORITY
            </span>

            {isManDown && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold bg-rose-900/80 border border-rose-600 text-rose-200 rounded-lg animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                AUTOMATIC MAN DOWN
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Victim Profile Header */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                {victimName} <span className="text-sm font-normal text-slate-400">({victimAge})</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                {location}
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 space-y-1">
              <p><span className="text-slate-500">SEQ ID:</span> #{seqId}</p>
              <p><span className="text-slate-500">TIME:</span> {new Date(createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Raw Distress Message */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Transmitted SOS Payload:
            </h4>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 leading-relaxed italic">
              "{rawText}"
            </div>
          </div>

          {/* LoRa Packet Telemetry */}
          <div className="grid grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ORIGIN NODE</span>
              <span className="text-cyan-400 font-bold text-sm">Node {nodeId}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">MESH HOPS</span>
              <span className="text-slate-200 font-bold text-sm">{hops} Hops</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SIGNAL (RSSI)</span>
              <span className="text-slate-200 font-bold text-sm">{rssi} dBm</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TRIGGER TYPE</span>
              <span className="text-purple-400 font-bold text-sm">{msgType}</span>
            </div>
          </div>

          {/* AI Medical Assessment */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Offline LLM Medical Assessment (Llama 3.2 1B)
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-slate-400 font-mono">Reasoning:</strong> {reasoning || 'Awaiting classification...'}
            </p>
            {recommendedAction && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs font-mono text-emerald-300">
                <strong>RECOMMENDED ACTION:</strong> {recommendedAction}
              </div>
            )}
          </div>

          {/* Commander Override & Dispatch Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Priority Override */}
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1.5">OVERRIDE AI PRIORITY:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOverridePriority(_id, 'RED')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                    priority === 'RED'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-red-400'
                  }`}
                >
                  RED (CRITICAL)
                </button>
                <button
                  onClick={() => onOverridePriority(_id, 'YELLOW')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                    priority === 'YELLOW'
                      ? 'bg-amber-600 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-400'
                  }`}
                >
                  YELLOW (URGENT)
                </button>
                <button
                  onClick={() => onOverridePriority(_id, 'GREEN')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                    priority === 'GREEN'
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  GREEN (MINOR)
                </button>
              </div>
            </div>

            {/* Dispatch Status Selector */}
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1.5">RESCUE DISPATCH STATUS:</span>
              <select
                value={dispatchStatus || 'PENDING'}
                onChange={(e) => onStatusChange(_id, e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono font-bold px-4 py-2 rounded-lg focus:outline-none"
              >
                <option value="PENDING">🔴 PENDING DISPATCH</option>
                <option value="DISPATCHED">🚀 TEAM DISPATCHED</option>
                <option value="RESCUED">✅ VICTIM RESCUED</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
