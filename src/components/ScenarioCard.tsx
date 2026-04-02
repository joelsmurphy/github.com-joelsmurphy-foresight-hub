'use client';

import { useState } from 'react';
import { Scenario, LeaderRole } from '@/types';
import { ARCHETYPE_META, TONE_META, ROLE_SCENARIO_CONFIG } from '@/data/scenarioConfig';

interface Props {
  scenario: Scenario;
  activeRole: LeaderRole;
  index: number;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={14} height={14} viewBox="0 0 14 14" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotIcon({ color }: { color: string }) {
  return (
    <span
      className="flex-shrink-0 inline-block w-1.5 h-1.5 rounded-full mt-2"
      style={{ background: color }}
    />
  );
}

export default function ScenarioCard({ scenario, activeRole, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [implTab, setImplTab] = useState<'pastor' | 'educator' | 'organizational'>(() => {
    if (activeRole === 'pastor') return 'pastor';
    if (activeRole === 'educator') return 'educator';
    return 'organizational';
  });

  const archMeta = ARCHETYPE_META[scenario.archetype];
  const toneMeta = TONE_META[scenario.emotional_tone] ?? { label: scenario.emotional_tone, color: '#94a3b8' };

  const implTabs: { key: 'pastor' | 'educator' | 'organizational'; label: string }[] = [
    { key: 'pastor', label: 'Pastor' },
    { key: 'educator', label: 'Educator' },
    { key: 'organizational', label: 'Org Leader' },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        border: `1px solid ${expanded ? archMeta.border : 'rgba(255,255,255,0.07)'}`,
        background: expanded ? archMeta.bg : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* ── Header (always visible) ── */}
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Index */}
        <span
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
          style={{ background: archMeta.bg, color: archMeta.color, border: `1px solid ${archMeta.border}` }}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: archMeta.bg, color: archMeta.color, border: `1px solid ${archMeta.border}` }}
            >
              {archMeta.label}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', color: toneMeta.color, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {toneMeta.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold leading-tight mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {scenario.title}
          </h3>
          <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {scenario.tagline}
          </p>

          {/* Snapshot */}
          <p className="text-sm leading-relaxed mt-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {scenario.snapshot}
          </p>
        </div>

        {/* Chevron */}
        <span className="flex-shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <ChevronIcon open={expanded} />
        </span>
      </button>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className="px-5 pb-6 flex flex-col gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Narrative */}
          <div className="pt-5">
            <SectionLabel>The Story</SectionLabel>
            <div className="flex flex-col gap-3 mt-3">
              {scenario.narrative.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Key drivers */}
          <div>
            <SectionLabel>Key Drivers</SectionLabel>
            <ul className="mt-3 flex flex-col gap-2">
              {scenario.key_drivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-2">
                  <DotIcon color={archMeta.color} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causal pathway */}
          <div>
            <SectionLabel>How We Got Here</SectionLabel>
            <ol className="mt-3 flex flex-col gap-3">
              {scenario.causal_pathway.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 24 }}>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: archMeta.bg, color: archMeta.color, border: `1px solid ${archMeta.border}` }}
                    >
                      {i + 1}
                    </span>
                    {i < scenario.causal_pathway.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: archMeta.border, minHeight: 12 }} />
                    )}
                  </div>
                  <div className="pb-2">
                    <span className="text-xs font-semibold block mb-0.5" style={{ color: archMeta.color }}>
                      {step.year_offset}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {step.event}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Role implications */}
          <div>
            <SectionLabel>What This Means For You</SectionLabel>
            {/* Tab bar */}
            <div
              className="flex mt-3 rounded-lg overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
            >
              {implTabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setImplTab(key)}
                  className="flex-1 py-2 text-xs font-semibold transition-all"
                  style={{
                    background: implTab === key ? archMeta.bg : 'transparent',
                    color: implTab === key ? archMeta.color : 'rgba(255,255,255,0.3)',
                    borderBottom: implTab === key ? `2px solid ${archMeta.color}` : '2px solid transparent',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Implications list */}
            <ul className="mt-3 flex flex-col gap-3">
              {(scenario.implications[implTab] ?? []).map((imp, i) => (
                <li
                  key={i}
                  className="rounded-lg px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-xs font-semibold block mb-1" style={{ color: archMeta.color }}>
                    {imp.sphere}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {imp.implication}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Discernment */}
          <div
            className="rounded-xl px-5 py-4"
            style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.1)' }}
          >
            <SectionLabel accent>Reflect</SectionLabel>
            <ul className="mt-3 flex flex-col gap-2.5">
              {scenario.discernment_prompts.map((prompt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 text-xs font-bold mt-0.5"
                    style={{ color: 'rgba(249,115,22,0.5)' }}
                  >○</span>
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {prompt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Faithful responses */}
          <div>
            <SectionLabel>Faithful Responses</SectionLabel>
            <ul className="mt-3 flex flex-col gap-2.5">
              {scenario.faithful_responses.map((resp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 font-bold text-sm mt-0.5"
                    style={{ color: archMeta.color }}
                  >→</span>
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {resp}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <h4
      className="text-xs font-bold uppercase tracking-widest"
      style={{ color: accent ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.3)' }}
    >
      {children}
    </h4>
  );
}
