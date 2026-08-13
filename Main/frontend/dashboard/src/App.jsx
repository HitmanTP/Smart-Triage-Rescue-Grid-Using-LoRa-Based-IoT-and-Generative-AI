import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TriageQueue from './components/TriageQueue';
import MeshHealthPanel from './components/MeshHealthPanel';
import SosDetailModal from './components/SosDetailModal';
import ManualSosModal from './components/ManualSosModal';
import { fetchTriageReports, fetchNodes, updateDispatchStatus, overridePriority, toggleMuteNode } from './services/api';
import { socket } from './services/socket';
import { playEmergencySiren } from './utils/audioAlert';

export default function App() {
  const [reports, setReports] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [audioMuted, setAudioMuted] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isManualSosOpen, setIsManualSosOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial state
  const loadData = async () => {
    try {
      const [triageRes, nodesRes] = await Promise.all([
        fetchTriageReports(),
        fetchNodes(),
      ]);

      if (triageRes.success) setReports(triageRes.data);
      if (nodesRes.success) setNodes(nodesRes.data);
    } catch (err) {
      console.error('Failed to fetch initial dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Poll node health every 5 seconds
    const interval = setInterval(async () => {
      try {
        const nodesRes = await fetchNodes();
        if (nodesRes.success) setNodes(nodesRes.data);
      } catch (err) {
        // silent fail on poll
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Socket.io Real-time Event Listeners
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewSos(data) {
      console.log('⚡ Real-time Socket Event: new_sos', data);
      const { triageReport, sosMessage, victim } = data;

      const fullReport = {
        ...triageReport,
        sosId: sosMessage,
        victimId: victim,
      };

      setReports((prev) => [fullReport, ...prev]);

      // Play emergency siren if RED or MAN DOWN
      if (!audioMuted && (triageReport.priority === 'RED' || triageReport.isManDown)) {
        playEmergencySiren();
      }
    }

    function onTriageUpdate(data) {
      console.log('⚡ Real-time Socket Event: triage_update', data);
      const { triageReportId, priority, reasoning, recommendedAction } = data;

      setReports((prev) =>
        prev.map((r) =>
          r._id === triageReportId
            ? { ...r, priority, reasoning, recommendedAction, aiProcessed: true }
            : r
        )
      );

      // Play siren if AI assigned RED
      if (!audioMuted && priority === 'RED') {
        playEmergencySiren();
      }
    }

    function onStatusUpdate(data) {
      console.log('⚡ Real-time Socket Event: status_update', data);
      const { triageReportId, dispatchStatus } = data;

      setReports((prev) =>
        prev.map((r) => (r._id === triageReportId ? { ...r, dispatchStatus } : r))
      );
    }

    function onPriorityOverride(data) {
      console.log('⚡ Real-time Socket Event: priority_override', data);
      const { triageReportId, priority } = data;

      setReports((prev) =>
        prev.map((r) => (r._id === triageReportId ? { ...r, priority, priorityOverride: true } : r))
      );
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_sos', onNewSos);
    socket.on('triage_update', onTriageUpdate);
    socket.on('status_update', onStatusUpdate);
    socket.on('priority_override', onPriorityOverride);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_sos', onNewSos);
      socket.off('triage_update', onTriageUpdate);
      socket.off('status_update', onStatusUpdate);
      socket.off('priority_override', onPriorityOverride);
    };
  }, [audioMuted]);

  // Handlers for user actions
  const handleStatusChange = async (id, status) => {
    try {
      // Optimistic update
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, dispatchStatus: status } : r))
      );
      await updateDispatchStatus(id, status);
    } catch (err) {
      console.error('Failed to update status:', err);
      loadData(); // revert on error
    }
  };

  const handleOverridePriority = async (id, priority) => {
    try {
      // Optimistic update
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, priority } : r))
      );
      await overridePriority(id, priority);
    } catch (err) {
      console.error('Failed to override priority:', err);
      loadData(); // revert on error
    }
  };

  const handleToggleMuteNode = async (nodeId) => {
    try {
      const res = await toggleMuteNode(nodeId);
      if (res.success) {
        setNodes((prev) =>
          prev.map((n) => (n.nodeId === nodeId ? { ...n, isMuted: !n.isMuted } : n))
        );
      }
    } catch (err) {
      console.error('Failed to mute node:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col">
      {/* Header Bar */}
      <Header
        isConnected={isConnected}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        onNewSosClick={() => setIsManualSosOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Quick Stats Banner */}
        <StatsBar reports={reports} nodes={nodes} />

        {/* Mesh Network Health Bar (FR12) */}
        <MeshHealthPanel nodes={nodes} onToggleMute={handleToggleMuteNode} />

        {/* Triage Queue Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Live Medical Triage Queue
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Sorted by Priority (RED → YELLOW → GREEN) & Timestamp
            </span>
          </div>

          <TriageQueue
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onStatusChange={handleStatusChange}
            onOverridePriority={handleOverridePriority}
          />
        </div>
      </main>

      {/* Modals */}
      <SosDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusChange={handleStatusChange}
        onOverridePriority={handleOverridePriority}
      />

      <ManualSosModal
        isOpen={isManualSosOpen}
        onClose={() => setIsManualSosOpen(false)}
        onSosCreated={() => loadData()}
      />
    </div>
  );
}
