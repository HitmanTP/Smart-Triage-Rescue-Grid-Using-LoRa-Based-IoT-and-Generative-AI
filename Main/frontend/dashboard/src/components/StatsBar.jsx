import React from 'react';
import { AlertCircle, Clock, CheckCircle2, UserCheck, Shield, Cpu } from 'lucide-react';

export default function StatsBar({ reports, nodes }) {
  const total = reports.length;
  const redCount = reports.filter((r) => r.priority === 'RED').length;
  const yellowCount = reports.filter((r) => r.priority === 'YELLOW').length;
  const greenCount = reports.filter((r) => r.priority === 'GREEN').length;
  const unclassifiedCount = reports.filter((r) => r.priority === 'UNCLASSIFIED' || !r.priority).length;
  const dispatchedCount = reports.filter((r) => r.dispatchStatus === 'DISPATCHED').length;
  const rescuedCount = reports.filter((r) => r.dispatchStatus === 'RESCUED').length;
  
  const activeNodesCount = nodes.filter((n) => n.status !== 'OFFLINE').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
      {/* Total SOS */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-slate-800 text-slate-300 rounded-lg">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total SOS</p>
          <p className="text-xl font-bold text-slate-100">{total}</p>
        </div>
      </div>

      {/* Critical Red */}
      <div className="bg-red-950/40 border border-red-900/60 p-3 rounded-xl flex items-center gap-3 shadow-md shadow-red-950/20">
        <div className="p-2 bg-red-900/60 text-red-400 rounded-lg">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider">Critical (Red)</p>
          <p className="text-xl font-bold text-red-300">{redCount}</p>
        </div>
      </div>

      {/* Urgent Yellow */}
      <div className="bg-amber-950/40 border border-amber-900/60 p-3 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-amber-900/60 text-amber-400 rounded-lg">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Urgent (Yellow)</p>
          <p className="text-xl font-bold text-amber-300">{yellowCount}</p>
        </div>
      </div>

      {/* Minor Green */}
      <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-emerald-900/60 text-emerald-400 rounded-lg">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Minor (Green)</p>
          <p className="text-xl font-bold text-emerald-300">{greenCount}</p>
        </div>
      </div>

      {/* Unclassified */}
      <div className="bg-purple-950/40 border border-purple-900/60 p-3 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-purple-900/60 text-purple-400 rounded-lg">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Manual Review</p>
          <p className="text-xl font-bold text-purple-300">{unclassifiedCount}</p>
        </div>
      </div>

      {/* Dispatched Teams */}
      <div className="bg-blue-950/40 border border-blue-900/60 p-3 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-blue-900/60 text-blue-400 rounded-lg">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Dispatched ({dispatchedCount}) / Rescued</p>
          <p className="text-xl font-bold text-blue-300">{rescuedCount}</p>
        </div>
      </div>

      {/* Active LoRa Mesh Nodes */}
      <div className="bg-cyan-950/40 border border-cyan-900/60 p-3 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-cyan-900/60 text-cyan-400 rounded-lg">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Mesh Nodes</p>
          <p className="text-xl font-bold text-cyan-300">{activeNodesCount} Active</p>
        </div>
      </div>
    </div>
  );
}
