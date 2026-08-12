import React from 'react';
import { CheckCircle2, ShieldCheck, Radio, RefreshCw } from 'lucide-react';

export default function SuccessState({ responseData, onReset }) {
  const seqId = responseData?.data?.sosMessage?.seqId || 'SEQ_CONFIRMED';
  const name = responseData?.data?.victim?.name || 'Victim';

  return (
    <div className="success-card">
      <div className="success-icon-wrap">
        <CheckCircle2 className="w-16 h-16 text-emerald animate-pulse" />
      </div>

      <h2 className="success-title">DISTRESS SIGNAL TRANSMITTED!</h2>
      <p className="success-desc">
        Your SOS has been encrypted and broadcast over the <strong>LoRa Mesh Network</strong> to the Incident Commander.
      </p>

      <div className="ticket-box">
        <div className="flex justify-between items-center mb-2 font-mono text-xs">
          <span className="text-muted">TRACKING SEQUENCE:</span>
          <span className="font-bold text-cyan">#{seqId}</span>
        </div>
        <div className="flex justify-between items-center font-mono text-xs">
          <span className="text-muted">VICTIM NAME:</span>
          <span className="font-bold text-white">{name}</span>
        </div>
      </div>

      <div className="status-badge">
        <Radio className="w-4 h-4 text-emerald animate-ping-slow" />
        <span>STATUS: QUEUED FOR RESCUE DISPATCH</span>
      </div>

      <p className="instruction-text">
        Please stay where you are if it is safe to do so. Keep your phone battery conserved.
      </p>

      <button onClick={onReset} className="btn-secondary">
        <RefreshCw className="w-4 h-4" />
        <span>SUBMIT ANOTHER UPDATE</span>
      </button>
    </div>
  );
}
