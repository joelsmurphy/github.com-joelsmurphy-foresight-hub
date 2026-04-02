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
import AnimatedBackground from '@/components/AnimatedBackground';

type Tab = 'scurve' | 'ministry' | 'scenarios';

const DEFAULT_FILTERS: FilterState = {
  disruption: new Set<DisruptionLevel>(['incremental', 'substantive', 'transformative']),
  stage: new Set<MaturityStage>(['emerging', 'scaling', 'established', 'structural']),
  showLabels: true,
};

const TABS: { id: Tab; label: string; icon: string; sub: string }[] = [
  { id: 'scurve',    label: 'Signal Map',         icon: '〜', sub: 'Track forces of change' },
  { id: 'ministry',  label: 'Ministry Assistant', icon: '✦', sub: 'Signals → strategy' },
  { id: 'scenarios', label: 'Scenario Generator', icon: '◈', sub: 'Explore possible futures' },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>('scurve');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const signals = SAMPLE_SIGNALS;
  const visibleSignals = signals.filter(
    s => filters.disruption.has(s.disruption_level) && filters.stage.has(s.maturity_stage),
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#041C2C' }}>

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <header className="relative flex-shrink-0" style={{ minHeight: 240 }}>
        <AnimatedBackground />

        <div className="relative z-10 flex flex-col items-center justify-center pt-12 pb-10 px-6">

          {/* Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              background: 'rgba(0,64,119,0.12)',
              border: '1px solid rgba(98,181,229,0.3)',
              boxShadow: '0 0 20px rgba(0,64,119,0.15)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#62B5E5', boxShadow: '0 0 6px #62B5E5' }}
            />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(98,181,229,0.9)' }}>
              Signal Intelligence for Ministry
            </span>
          </div>

          {/* Wordmark */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="neon-box w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,64,119,0.2), rgba(196,20,36,0.12))',
                border: '1px solid rgba(98,181,229,0.35)',
              }}
            >
              <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 15 Q5 4 9 9 Q13 14 16 3"
                  stroke="url(#grad)" strokeWidth={1.8} strokeLinecap="round" fill="none"
                />
                <circle cx={9} cy={9} r={1.8} fill="rgba(98,181,229,0.9)" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#62B5E5" />
                    <stop offset="100%" stopColor="#C41424" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1
              className="neon-text font-bold"
              style={{
                fontSize: '2rem',
                letterSpacing: '0.08em',
                color: '#62B5E5',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
              }}
            >
              Foresight Hub
            </h1>
          </div>

          {/* Decorative rule */}
          <div className="flex items-center gap-4 mb-8" style={{ width: '100%', maxWidth: 500 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(98,181,229,0.4))' }} />
            <div className="flex gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(98,181,229,0.6)' }} />
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(196,20,36,0.6)' }} />
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(98,181,229,0.6)' }} />
            </div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(98,181,229,0.4))' }} />
          </div>

          {/* Tab navigation */}
          <nav
            className="flex rounded-2xl p-1 gap-1"
            style={{
              background: 'rgba(4, 28, 44, 0.85)',
              border: '1px solid rgba(98,181,229,0.2)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            {TABS.map(({ id, label, icon, sub }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex flex-col items-center px-5 py-3 rounded-xl transition-all"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, rgba(0,64,119,0.25), rgba(196,20,36,0.1))'
                      : 'transparent',
                    border: active
                      ? '1px solid rgba(98,181,229,0.35)'
                      : '1px solid transparent',
                    boxShadow: active
                      ? '0 0 24px rgba(0,64,119,0.2), inset 0 1px 0 rgba(98,181,229,0.12)'
                      : 'none',
                    minWidth: 120,
                  }}
                >
                  <span style={{ fontSize: '1rem', marginBottom: 3, opacity: active ? 1 : 0.35 }}>
                    {icon}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{
                      color: active ? '#62B5E5' : 'rgba(200,220,240,0.35)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="hidden sm:block mt-0.5"
                    style={{ fontSize: '0.6rem', color: active ? 'rgba(98,181,229,0.45)' : 'rgba(200,220,240,0.18)' }}
                  >
                    {sub}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 sm:px-6 py-8">

        {tab === 'scurve' && (
          <div className="flex flex-col gap-4 fade-in">
            <div className="flex items-end justify-between">
              <div>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: '#62B5E5', letterSpacing: '0.04em' }}
                >
                  Signals of Change
                </h2>
                <p className="text-sm" style={{ color: 'rgba(200,220,240,0.4)' }}>
                  {signals.length} signals mapped across four maturity zones
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-44">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  signalCount={signals.length}
                  visibleCount={visibleSignals.length}
                />
              </div>

              <div className="flex-1 flex gap-4 min-w-0">
                <div
                  className="flex-1 rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(4,28,44,0.7)',
                    border: '1px solid rgba(98,181,229,0.15)',
                    boxShadow: '0 0 40px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.2)',
                    minWidth: 0,
                  }}
                >
                  <SCurveVisualization
                    signals={signals}
                    filters={filters}
                    selectedSignal={selectedSignal}
                    onSignalClick={s => setSelectedSignal(prev => prev?.id === s.id ? null : s)}
                  />
                </div>

                {selectedSignal && (
                  <div
                    className="flex-shrink-0 rounded-2xl overflow-hidden fade-in"
                    style={{ width: 300, height: '100%', maxHeight: 540 }}
                  >
                    <SignalCard signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
                  </div>
                )}
              </div>
            </div>

            <HowToRead />

            <p className="text-center text-xs" style={{ color: 'rgba(200,220,240,0.2)' }}>
              Click any signal dot to open its information card · Hover for a preview
            </p>
          </div>
        )}

        {tab === 'ministry' && (
          <div className="fade-in">
            <MinistryAssistant signals={signals} />
          </div>
        )}

        {tab === 'scenarios' && (
          <div className="fade-in">
            <ScenarioGenerator />
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(98,181,229,0.08)' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(98,181,229,0.3)' }}>
          Foresight Hub
        </span>
        <span className="text-xs" style={{ color: 'rgba(200,220,240,0.15)' }}>
          Signals are illustrative — replace with your own dataset
        </span>
      </footer>
    </div>
  );
}
