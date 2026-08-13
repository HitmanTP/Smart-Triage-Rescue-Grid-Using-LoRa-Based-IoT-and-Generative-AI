// Web Audio API emergency alert sound synthesizer (no external audio file required)
export const playEmergencySiren = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    
    // Frequency modulation for emergency siren sound
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.3); // A4
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.6); // A5
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.8);
  } catch (err) {
    console.warn('Audio context playback blocked or unsupported:', err);
  }
};
