import React, { useState } from 'react';
import Header from './components/Header';
import VictimForm from './components/VictimForm';
import SuccessState from './components/SuccessState';

export default function App() {
  const [submittedData, setSubmittedData] = useState(null);

  return (
    <div className="portal-container">
      <Header />
      <main className="flex-1">
        {submittedData ? (
          <SuccessState
            responseData={submittedData}
            onReset={() => setSubmittedData(null)}
          />
        ) : (
          <VictimForm onSuccess={(data) => setSubmittedData(data)} />
        )}
      </main>
      <footer className="text-center py-4 text-[10px] font-mono text-slate-500">
        SMART TRIAGE & RESCUE GRID • OFF-GRID CAPTIVE PORTAL V1.0
      </footer>
    </div>
  );
}
