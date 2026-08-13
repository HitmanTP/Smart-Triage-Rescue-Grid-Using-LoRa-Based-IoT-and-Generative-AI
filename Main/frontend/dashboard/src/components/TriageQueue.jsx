import React, { useState } from 'react';
import SosCard from './SosCard';
import { Search, Filter, ShieldAlert } from 'lucide-react';

export default function TriageQueue({ reports, onSelectReport, onStatusChange, onOverridePriority }) {
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter((r) => {
    // Priority filter
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;

    // Status filter
    if (statusFilter !== 'ALL' && r.dispatchStatus !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const victimName = r.victimId?.name?.toLowerCase() || '';
      const location = r.victimId?.locationContext?.toLowerCase() || '';
      const seqId = r.sosId?.seqId?.toLowerCase() || '';
      const text = r.sosId?.rawText?.toLowerCase() || '';
      
      return (
        victimName.includes(q) ||
        location.includes(q) ||
        seqId.includes(q) ||
        text.includes(q)
      );
    }

    return true;
  });

  const priorityOrder = { RED: 1, YELLOW: 2, GREEN: 3, UNCLASSIFIED: 4 };
  filteredReports.sort((a, b) => {
    const pDiff = (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
    if (pDiff !== 0) return pDiff;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="space-y-4">
      {/* Control Bar: Tabs & Search */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'RED', 'YELLOW', 'GREEN', 'UNCLASSIFIED'].map((tab) => {
            const counts = {
              ALL: reports.length,
              RED: reports.filter((r) => r.priority === 'RED').length,
              YELLOW: reports.filter((r) => r.priority === 'YELLOW').length,
              GREEN: reports.filter((r) => r.priority === 'GREEN').length,
              UNCLASSIFIED: reports.filter((r) => r.priority === 'UNCLASSIFIED' || !r.priority).length,
            };

            const colors = {
              ALL: 'hover:text-slate-200',
              RED: 'text-red-400 font-bold',
              YELLOW: 'text-amber-400 font-bold',
              GREEN: 'text-emerald-400 font-bold',
              UNCLASSIFIED: 'text-purple-400 font-bold',
            };

            const isSelected = priorityFilter === tab;

            return (
              <button
                key={tab}
                onClick={() => setPriorityFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 font-bold shadow'
                    : `text-slate-400 ${colors[tab]} bg-transparent hover:bg-slate-800/50`
                }`}
              >
                <span>{tab}</span>
                <span className="px-1.5 py-0.2 bg-slate-950/80 text-[10px] rounded border border-slate-700">
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-mono text-slate-300 focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="PENDING" className="bg-slate-900">Pending Only</option>
              <option value="DISPATCHED" className="bg-slate-900">Dispatched Only</option>
              <option value="RESCUED" className="bg-slate-900">Rescued Only</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search victim, seqId, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-600 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <SosCard
              key={report._id}
              report={report}
              onSelect={onSelectReport}
              onStatusChange={onStatusChange}
              onOverridePriority={onOverridePriority}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300 font-mono">No Triage Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-mono">
            {reports.length === 0
              ? 'Waiting for incoming SOS distress signals over LoRa mesh...'
              : 'No distress signals match your selected filter criteria.'}
          </p>
        </div>
      )}
    </div>
  );
}
