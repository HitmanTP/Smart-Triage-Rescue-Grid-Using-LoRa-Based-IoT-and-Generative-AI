import React, { useState } from 'react';
import { X, Send, ShieldAlert, User, MapPin, FileText } from 'lucide-react';
import api from '../services/api';

export default function ManualSosModal({ isOpen, onClose, onSosCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    locationContext: '',
    rawText: '',
    type: 'MANUAL',
    nodeId: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rawText.trim()) {
      setError('Distress text description is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/sos', {
        ...formData,
        name: formData.name.trim() || 'Anonymous Victim',
        age: formData.age ? parseInt(formData.age, 10) : undefined,
      });

      if (res.data.success) {
        if (onSosCreated) onSosCreated(res.data.data);
        onClose();
        setFormData({ name: '', age: '', locationContext: '', rawText: '', type: 'MANUAL', nodeId: 1 });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit manual SOS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400 font-mono font-bold">
            <ShieldAlert className="w-5 h-5" />
            <span>MANUAL COMMANDER SOS ENTRY</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">VICTIM NAME</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">AGE</label>
              <input
                type="number"
                placeholder="e.g. 34"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">SIGNAL TYPE</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="MANUAL">MANUAL SOS</option>
                <option value="AUTO">MAN DOWN (AUTO)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">LOCATION CONTEXT</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Block C, 3rd Floor, Room 302"
                value={formData.locationContext}
                onChange={(e) => setFormData({ ...formData, locationContext: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">DISTRESS TEXT DESCRIPTION *</label>
            <textarea
              rows={3}
              placeholder="e.g. Trapped under debris, severe arm bleeding, difficulty breathing."
              value={formData.rawText}
              onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-3 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'SUBMITTING...' : 'DISPATCH TO AI TRIAGE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
