'use client';

import { useState } from 'react';
import { Signal, FilterState, DisruptionLevel, MaturityStage } from '@/types';
import { SAMPLE_SIGNALS } from '@/data/signals';
import SCurveVisualization from '@/components/SCurveVisualization';
import SignalCard from '@/components/SignalCard';
import FilterPanel from '@/components/FilterPanel';
import HowToRead from '@/components/HowToRead';
import MinistryAssistant from '@/components/MinistryAssistant';
import ScenarioGenerator from '@/components/ScenarioGenerator';

type Tab = 'scurve' | 'ministry' | 'scenarios';

const DEFAULT_FILTERS: FilterState = {
  disruption: new Set<DisruptionLevel>(['incremental', 'substantive', 'transformative']),
  stage: new Set<MaturityStage>(['emerging', 'scaling', 'established', 'structural']),
  showLabels: true,
};

export default function Home() {
  const [tab, setTab] = useState<Tab>('scurve');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const signals = SAMPLE_SIGNALS;
  const visibleSignals = signals.filter(
    (s) => filters.disruption.has(s.disruption_level) && filters.stage.has(s.maturity_stage),
  );

  const handleSignalClick = (signal: Signal) => {
    setSelectedSignal((prev) => (prev?.id === signal.id ? null : signal));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>

      {/* ── Top navigation ── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.6), rgba(239,68,68,0.5))', boxShadow: '0 0 12px rgba(249,115,22,0.3)' }}
          >
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <path d="M1 12 Q4 2 7 7 Q10 12 13 2" stroke="white" strokeWidth={1.8} strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Foresight Hub</span>
            <span className="hidden sm:inline text-xs ml-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Signal Intelligence for Ministry</span>
          </div>
        </div>

        {/* Tab switcher */}
        <nav
          className="flex rounded-xl p-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {([
            { id: 'scurve' as Tab,    label: 'S-Curve Map',          icon: '〜' },
            { id: 'ministry' as Tab,  label: 'Ministry Assistant',    icon: '✦' },
            { id: 'scenarios' as Tab, label: 'Scenario Generator',    icon: '◈' },
          ] as const).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === id ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: tab === id ? 'rgba(249,115,22,0.95)' : 'rgba(255,255,255,0.35)',
                border: tab === id ? '1px solid rgba(249,115,22,0.25)' : '1px solid transparent',
              }}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 px-4 sm:px-6 py-6">

        {/* ─── S-Curve tab ─── */}
        {tab === 'scurve' && (
          <div className="flex flex-col gap-4">

            {/* Page title */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  Signals of Change
                </h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {signals.length} signals mapped across four maturity zones
                </p>
              </div>
            </div>

            {/* Chart area */}
            <div className="flex gap-4">

              {/* Filter sidebar */}
              <div className="flex-shrink-0 w-44">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  signalCount={signals.length}
                  visibleCount={visibleSignals.length}
                />
              </div>

              {/* Chart + card */}
              <div className="flex-1 flex gap-4 min-w-0">
                {/* Chart */}
                <div
                  className="flex-1 rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    minWidth: 0,
                  }}
                >
                  <SCurveVisualization
                    signals={signals}
                    filters={filters}
                    selectedSignal={selectedSignal}
                    onSignalClick={handleSignalClick}
                  />
                </div>

                {/* Signal card panel */}
                {selectedSignal && (
                  <div
                    className="flex-shrink-0 rounded-xl overflow-hidden fade-in"
                    style={{ width: 300, height: '100%', maxHeight: 540 }}
                  >
                    <SignalCard
                      signal={selectedSignal}
                      onClose={() => setSelectedSignal(null)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* How to read */}
            <HowToRead />

            {/* Hint */}
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Click any signal dot to open its full information card · Hover for a quick preview
            </p>
          </div>
        )}

        {/* ─── Ministry assistant tab ─── */}
        {tab === 'ministry' && (
          <div className="fade-in">
            <MinistryAssistant signals={signals} />
          </div>
        )}

        {/* ─── Scenario generator tab ─── */}
        {tab === 'scenarios' && (
          <div className="fade-in">
            <ScenarioGenerator />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Foresight Hub · Signal Intelligence for Ministry
        </span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.1)' }}>
          Signals are illustrative — replace with your own dataset
        </span>
      </footer>
    </div>
  );
}
