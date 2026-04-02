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
import HeroFigure from '@/components/HeroFigure';
import Reveal from '@/components/Reveal';

type ToolTab = 'ministry' | 'scenarios';

const DEFAULT_FILTERS: FilterState = {
  disruption: new Set<DisruptionLevel>(['incremental', 'substantive', 'transformative']),
  stage: new Set<MaturityStage>(['emerging', 'scaling', 'established', 'structural']),
  showLabels: true,
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [toolTab, setToolTab] = useState<ToolTab>('ministry');

  const signals = SAMPLE_SIGNALS;
  const visibleSignals = signals.filter(
    s => filters.disruption.has(s.disruption_level) && filters.stage.has(s.maturity_stage),
  );

  return (
    <div style={{ background: '#041C2C' }}>

      {/* ════════════════════════════════════════════════════════════
          HERO — full viewport
      ════════════════════════════════════════════════════════════ */}
      <section className="relative" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AnimatedBackground />

        {/* ── Top nav ─────────────────────────────────────────── */}
        <nav
          className="relative z-20 flex items-center justify-between px-8 py-5"
          style={{ borderBottom: '1px solid rgba(98,181,229,0.08)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="neon-box w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,64,119,0.25), rgba(196,20,36,0.12))',
                border: '1px solid rgba(98,181,229,0.35)',
              }}
            >
              <svg width={14} height={14} viewBox="0 0 18 18" fill="none">
                <path d="M2 15 Q5 4 9 9 Q13 14 16 3" stroke="url(#ng)" strokeWidth={1.8} strokeLinecap="round" />
                <circle cx={9} cy={9} r={1.6} fill="rgba(98,181,229,0.9)" />
                <defs>
                  <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#62B5E5" />
                    <stop offset="100%" stopColor="#C41424" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span
              className="font-bold uppercase tracking-widest text-sm"
              style={{ color: '#62B5E5', fontFamily: 'var(--font-montserrat)' }}
            >
              Foresight Hub
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Signal Map', href: '#signals' },
              { label: 'Ministry Assistant', href: '#tools' },
              { label: 'Scenario Generator', href: '#tools' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'rgba(200,220,240,0.45)', letterSpacing: '0.07em' }}
                onClick={label === 'Scenario Generator' ? () => setToolTab('scenarios') : label === 'Ministry Assistant' ? () => setToolTab('ministry') : undefined}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,64,119,0.1)',
              border: '1px solid rgba(98,181,229,0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#62B5E5', boxShadow: '0 0 5px #62B5E5' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(98,181,229,0.85)' }}>
              Signal Intelligence
            </span>
          </div>
        </nav>

        {/* ── Hero body ────────────────────────────────────────── */}
        <div
          className="relative z-10 flex-1 flex items-center px-8 md:px-16 lg:px-24"
          style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
        >
          <div className="w-full grid md:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <Reveal variant="left" className="flex flex-col">

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 32, height: 1, background: '#C41424', opacity: 0.7 }} />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(196,20,36,0.8)' }}
                >
                  Foresight for Ministry Leadership
                </span>
              </div>

              {/* Main headline */}
              <h1
                className="font-bold leading-none mb-2"
                style={{
                  fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                  fontFamily: 'var(--font-montserrat)',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                See What&apos;s{' '}
                <span
                  className="neon-text"
                  style={{ color: '#62B5E5', display: 'inline' }}
                >
                  Coming
                </span>
              </h1>
              <h1
                className="font-bold leading-none mb-8"
                style={{
                  fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                  fontFamily: 'var(--font-montserrat)',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '-0.02em',
                }}
              >
                Before It Arrives
              </h1>

              {/* Body */}
              <p
                className="mb-10 leading-relaxed"
                style={{
                  fontSize: '1.05rem',
                  color: 'rgba(200,220,240,0.55)',
                  maxWidth: 420,
                  fontFamily: 'var(--font-spectral)',
                }}
              >
                An interactive intelligence platform for ministry leaders navigating disruption — mapping signals of change, generating strategic scenarios, and discerning faithful responses.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href="#signals"
                  className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide"
                  style={{
                    background: 'linear-gradient(135deg, #004077, #005fa3)',
                    color: '#ffffff',
                    border: '1px solid rgba(98,181,229,0.4)',
                    boxShadow: '0 0 30px rgba(0,64,119,0.4)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Explore Signal Map
                </a>
                <a
                  href="#tools"
                  onClick={() => setToolTab('scenarios')}
                  className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide"
                  style={{
                    background: 'rgba(196,20,36,0.1)',
                    color: 'rgba(255,120,130,0.9)',
                    border: '1px solid rgba(196,20,36,0.35)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Generate Scenarios
                </a>
              </div>

              {/* Stats row */}
              <div className="flex gap-8">
                {[
                  { value: `${signals.length}`, label: 'Signals Mapped' },
                  { value: '4', label: 'Maturity Zones' },
                  { value: '4', label: 'Future Archetypes' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div
                      className="font-bold"
                      style={{
                        fontSize: '2rem',
                        color: '#62B5E5',
                        fontFamily: 'var(--font-montserrat)',
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wide mt-1"
                      style={{ color: 'rgba(200,220,240,0.35)', letterSpacing: '0.07em' }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right — futuristic figure */}
            <Reveal variant="right" delay={1} className="flex items-center justify-center">
              <HeroFigure />
            </Reveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex flex-col items-center pb-8 gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(200,220,240,0.25)', letterSpacing: '0.1em' }}>
            Scroll to explore
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: 'linear-gradient(to bottom, rgba(98,181,229,0.4), transparent)',
            }}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SIGNAL MAP SECTION
      ════════════════════════════════════════════════════════════ */}
      <section id="signals" className="px-6 md:px-12 py-20">

        {/* Section header */}
        <Reveal>
        <div className="flex items-center gap-4 mb-2">
          <div style={{ width: 24, height: 1, background: '#C41424', opacity: 0.7 }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(196,20,36,0.7)' }}>
            Signal Intelligence
          </span>
        </div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="font-bold mb-2"
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                color: '#ffffff',
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '-0.01em',
              }}
            >
              Signals of{' '}
              <span style={{ color: '#62B5E5' }}>Change</span>
            </h2>
            <p className="text-sm" style={{ color: 'rgba(200,220,240,0.4)' }}>
              {signals.length} signals mapped across four maturity zones
            </p>
          </div>
        </div>
        </Reveal>

        {/* Map layout */}
        <Reveal delay={1}>
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
        </Reveal>

        <Reveal delay={2}>
        <div className="mt-4">
          <HowToRead />
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(200,220,240,0.2)' }}>
          Click any signal dot to open its information card · Hover for a preview
        </p>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TOOLS SECTION — Ministry Assistant + Scenario Generator
      ════════════════════════════════════════════════════════════ */}
      <section
        id="tools"
        className="px-6 md:px-12 py-20"
        style={{ borderTop: '1px solid rgba(98,181,229,0.08)' }}
      >
        {/* Section header */}
        <Reveal>
        <div className="flex items-center gap-4 mb-2">
          <div style={{ width: 24, height: 1, background: '#C41424', opacity: 0.7 }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(196,20,36,0.7)' }}>
            Strategic Tools
          </span>
        </div>
        <h2
          className="font-bold mb-8"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#ffffff',
            fontFamily: 'var(--font-montserrat)',
            letterSpacing: '-0.01em',
          }}
        >
          Signals →{' '}
          <span style={{ color: '#62B5E5' }}>Strategy</span>
        </h2>
        </Reveal>

        {/* Tool tab nav */}
        <div
          className="flex rounded-xl p-1 gap-1 mb-8 w-fit"
          style={{
            background: 'rgba(4,28,44,0.85)',
            border: '1px solid rgba(98,181,229,0.15)',
          }}
        >
          {([
            { id: 'ministry' as ToolTab,  label: 'Ministry Assistant', icon: '✦' },
            { id: 'scenarios' as ToolTab, label: 'Scenario Generator',  icon: '◈' },
          ]).map(({ id, label, icon }) => {
            const active = toolTab === id;
            return (
              <button
                key={id}
                onClick={() => setToolTab(id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all"
                style={{
                  background: active
                    ? 'linear-gradient(135deg, rgba(0,64,119,0.3), rgba(196,20,36,0.1))'
                    : 'transparent',
                  border: active ? '1px solid rgba(98,181,229,0.3)' : '1px solid transparent',
                  color: active ? '#62B5E5' : 'rgba(200,220,240,0.35)',
                  letterSpacing: '0.06em',
                  boxShadow: active ? '0 0 20px rgba(0,64,119,0.2)' : 'none',
                }}
              >
                <span style={{ opacity: active ? 1 : 0.4 }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Tool content */}
        <Reveal key={toolTab}>
        <div className="fade-in" key={toolTab}>
          {toolTab === 'ministry'
            ? <MinistryAssistant signals={signals} />
            : <ScenarioGenerator />
          }
        </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer
        className="px-8 py-6 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(98,181,229,0.08)' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(98,181,229,0.25)', fontFamily: 'var(--font-montserrat)' }}>
          Foresight Hub
        </span>
        <span className="text-xs" style={{ color: 'rgba(200,220,240,0.15)' }}>
          Signals are illustrative — replace with your own dataset
        </span>
      </footer>
    </div>
  );
}
