import React from 'react';
import { Cpu, Battery, BatteryCharging, Radio, VolumeX, Volume2, Activity, AlertOctagon } from 'lucide-react';

export default function MeshHealthPanel({ nodes, onToggleMute }) {
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Never';
    const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    return `${Math.floor(diffSec / 3600)}h ago`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            LoRa Mesh Network Health (FR12)
          </h2>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
          {nodes.length} NODES TRACKED
        </span>
      </div>

      {nodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nodes.map((node) => {
            const isLowBatt = node.batteryPercent < 20;
            const isMuted = node.isMuted;

            // Battery bar color calculation
            const getBatteryColor = (pct) => {
              if (pct > 50) return 'bg-emerald-500';
              if (pct >= 20) return 'bg-amber-500';
              return 'bg-red-500 animate-pulse';
            };

            return (
              <div
                key={node._id || node.nodeId}
                className={`p-3.5 rounded-lg border transition-all ${
                  isMuted
                    ? 'bg-slate-950/60 border-slate-800 opacity-60'
                    : isLowBatt
                    ? 'bg-red-950/20 border-red-900/80 shadow-md shadow-red-950/30'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className={`w-4 h-4 ${isMuted ? 'text-slate-500' : 'text-cyan-400'}`} />
                    <span className="font-mono font-bold text-sm text-slate-200">
                      NODE #{node.nodeId}
                    </span>
                    {isMuted && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                        MUTED
                      </span>
                    )}
                  </div>

                  {/* Mute Toggle Button */}
                  <button
                    onClick={() => onToggleMute(node.nodeId)}
                    className={`p-1.5 rounded-md transition-colors ${
                      isMuted
                        ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400'
                    }`}
                    title={isMuted ? 'Unmute Node' : 'Mute Node'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Battery Status Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-slate-400" /> Battery
                    </span>
                    <span className={`font-bold ${isLowBatt ? 'text-red-400' : 'text-slate-200'}`}>
                      {node.batteryPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${getBatteryColor(node.batteryPercent)}`}
                      style={{ width: `${Math.max(5, node.batteryPercent)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Signals & Heartbeat */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500">RSSI:</span>{' '}
                    <span className="text-slate-300 font-semibold">{node.rssi} dBm</span>
                  </div>
                  <div>
                    <span className="text-slate-500">SNR:</span>{' '}
                    <span className="text-slate-300 font-semibold">{node.snr || 0} dB</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Heartbeat:</span>
                    <span className="text-slate-400">{timeAgo(node.lastHeartbeat)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 font-mono text-xs">
          No LoRa nodes registered yet.
        </div>
      )}
    </div>
  );
}
