import React from 'react';
import { ShieldAlert, Wifi, Radio } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="icon-badge">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="header-title">EMERGENCY SOS</h1>
            <p className="header-sub">OFF-GRID DISASTER RESCUE GRID</p>
          </div>
        </div>

        <div className="wifi-badge">
          <span className="dot animate-ping-slow"></span>
          <span>NODE #1 CONNECTED</span>
        </div>
      </div>

      <div className="info-banner">
        <Radio className="w-4 h-4 text-cyan" />
        <span>No mobile signal required. Form is sent via <strong>LoRa Radio Mesh</strong> directly to Rescue Command.</span>
      </div>
    </header>
  );
}
