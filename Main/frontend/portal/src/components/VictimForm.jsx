import React, { useState } from 'react';
import QuickPresets from './QuickPresets';
import { compressSosPayload } from '../utils/compressor';
import { submitSosForm } from '../services/api';
import { Send, User, MapPin, FileText, Cpu, AlertCircle } from 'lucide-react';

export default function VictimForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    locationContext: '',
    rawText: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate live byte compression constraint (< 256 bytes)
  const payloadStats = compressSosPayload(formData);

  const handlePresetSelect = (presetText) => {
    setFormData((prev) => ({
      ...prev,
      rawText: presetText,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rawText.trim()) {
      setError('Please describe your injury or distress situation.');
      return;
    }

    if (!payloadStats.isValid) {
      setError('Text description is too long for LoRa radio packet limit. Please shorten slightly.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await submitSosForm(formData);
      if (response.success) {
        onSuccess(response);
      }
    } catch (err) {
      console.error('SOS Submit Error:', err);
      setError(err.response?.data?.message || 'Failed to transmit SOS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      {error && (
        <div className="error-box">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Tap Quick Presets */}
      <QuickPresets onSelectPreset={handlePresetSelect} />

      {/* Victim Info Inputs */}
      <div className="input-group">
        <label className="input-label">YOUR NAME (OPTIONAL)</label>
        <div className="input-wrap">
          <User className="input-icon" />
          <input
            type="text"
            placeholder="e.g. Priya Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="input-label">AGE</label>
          <input
            type="number"
            placeholder="e.g. 28"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="text-input no-icon"
          />
        </div>

        <div>
          <label className="input-label font-mono text-[10px]">LORA PAYLOAD METER</label>
          <div className={`payload-meter ${payloadStats.isValid ? 'valid' : 'invalid'}`}>
            <span>{payloadStats.byteSize} / 256 BYTES</span>
          </div>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">LOCATION CONTEXT (WHERE ARE YOU?)</label>
        <div className="input-wrap">
          <MapPin className="input-icon" />
          <input
            type="text"
            placeholder="e.g. Rooftop of Community Center, 3rd Floor"
            value={formData.locationContext}
            onChange={(e) => setFormData({ ...formData, locationContext: e.target.value })}
            className="text-input"
          />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">INJURY & DISTRESS DESCRIPTION *</label>
        <div className="input-wrap">
          <FileText className="input-icon top-3" />
          <textarea
            rows={3}
            placeholder="Describe injuries, trapped condition, or medical needs..."
            value={formData.rawText}
            onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
            className="text-input textarea-input"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading} className="btn-primary">
        <Send className="w-5 h-5" />
        <span>{loading ? 'BROADCASTING VIA LORA MESH...' : 'SEND DISTRESS SIGNAL NOW'}</span>
      </button>
    </form>
  );
}
