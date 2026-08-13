import React from 'react';
import { Radio, Volume2, VolumeX, ShieldAlert, Activity, Wifi } from 'lucide-react';

export default function Header({ isConnected, audioMuted, setAudioMuted, onNewSosClick }) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-40 px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title and Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-950/70 border border-red-800/60 rounded-xl text-red-500 shadow-lg shadow-red-950/50">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase">
                Smart Triage & Rescue Grid
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono bg-blue-950 border border-blue-800 text-blue-400 rounded">
                COMMANDER MODE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wide">
              OFF-GRID DISASTER RESPONSE PLATFORM • LORA MESH & LOCAL AI ENGINE
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Socket Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
            </span>
            <span className={isConnected ? 'text-emerald-400' : 'text-rose-400'}>
              {isConnected ? 'LIVE MESH ONLINE' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-mono transition-all ${
              audioMuted
                ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-red-950/50 border-red-800 text-red-400 hover:bg-red-900/50 shadow-md shadow-red-950/40'
            }`}
            title={audioMuted ? 'Unmute Audio Siren' : 'Mute Audio Siren'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
            <span>{audioMuted ? 'SIREN MUTED' : 'SIREN ACTIVE'}</span>
          </button>

          {/* Manual SOS Entry Trigger Button */}
          <button
            onClick={onNewSosClick}
            className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-red-950/60 border border-red-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>+ COMMANDER SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
