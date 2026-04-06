'use client';

import React, { useState } from 'react';
import { LeaderRole, MinistryOutput, MinistryContext } from '@/types';
import { Signal } from '@/types';
import { CONTEXT_QUESTIONS, ROLE_LABELS, SPHERES } from '@/data/signals';

interface Props {
  signals: Signal[];
}

// SVG line icons — one per role
const ROLE_ICONS: Record<LeaderRole, React.ReactNode> = {
  pastor: (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* Cross */}
      <line x1="9" y1="2" x2="9" y2="12" />
      <line x1="5.5" y1="5.5" x2="12.5" y2="5.5" />
      {/* Base */}
      <line x1="6" y1="16" x2="12" y2="16" />
      <line x1="9" y1="12" x2="9" y2="16" />
    </svg>
  ),
  denominational: (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* Building columns */}
      <line x1="2" y1="16" x2="16" y2="16" />
      <line x1="4" y1="16" x2="4" y2="9" />
      <line x1="9" y1="16" x2="9" y2="9" />
      <line x1="14" y1="16" x2="14" y2="9" />
      <polyline points="1,9 9,3 17,9" />
    </svg>
  ),
  educator: (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* Open book */}
      <path d="M9 4 C9 4 6 3 3 4 L3 15 C6 14 9 15 9 15 C9 15 12 14 15 15 L15 4 C12 3 9 4 9 4Z" />
      <line x1="9" y1="4" x2="9" y2="15" />
    </svg>
  ),
  member: (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* Two people */}
      <circle cx="7" cy="5.5" r="2.5" />
      <path d="M2 16 C2 12.5 4 11 7 11 C10 11 12 12.5 12 16" />
      <circle cx="13" cy="5.5" r="2" />
      <path d="M13 10 C15.5 10 17 11.5 17 14.5" />
    </svg>
  ),
};

const ROLES: { value: LeaderRole; label: string }[] = [
  { value: 'pastor',        label: 'Pastor' },
  { value: 'denominational',label: 'Denominational / Org Leader' },
  { value: 'member',        label: 'Volunteer Leader' },
];

const LEVEL_META = {
  incremental: {
    label: 'Response A — Incremental',
    sub: 'Achievable this month within existing resources',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.18)',
  },
  developmental: {
    label: 'Response B — Developmental',
    sub: 'Achievable in 12–18 months with focused effort',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.18)',
  },
  transformational: {
    label: 'Response C — Transformational',
    sub: 'Bold, stretching — challenges core assumptions',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.18)',
  },
} as const;

type LevelKey = keyof typeof LEVEL_META;

function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <span
      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
      style={{
        background: done ? 'rgba(249,115,22,0.25)' : active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.06)',
        color: done ? '#f97316' : active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
        border: done ? '1px solid rgba(249,115,22,0.4)' : active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
      }}
    >
      {done ? '✓' : n}
    </span>
  );
}

function SphereBlock({ sphere, index }: { sphere: MinistryOutput['spheres'][number]; index: number }) {
  const [activeLevel, setActiveLevel] = useState<LevelKey>('incremental');

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Sphere header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: 'rgba(249,115,22,0.12)', color: 'rgba(249,115,22,0.8)' }}
          >
            {index + 1}
          </span>
          <h3 className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {sphere.sphere_name}
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {sphere.implication}
        </p>
      </div>

      {/* Level tabs */}
      <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {(Object.keys(LEVEL_META) as LevelKey[]).map((key) => {
          const meta = LEVEL_META[key];
          const isActive = activeLevel === key;
          return (
            <button
              key={key}
              onClick={() => setActiveLevel(key)}
              className="flex-1 py-2.5 px-2 text-center transition-all"
              style={{
                background: isActive ? meta.bg : 'transparent',
                borderBottom: isActive ? `2px solid ${meta.color}` : '2px solid transparent',
              }}
            >
              <span
                className="text-xs font-semibold block"
                style={{ color: isActive ? meta.color : 'rgba(255,255,255,0.25)' }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Response content */}
      {(Object.keys(LEVEL_META) as LevelKey[]).map((key) => {
        const meta = LEVEL_META[key];
        const items = sphere.responses[key];
        if (activeLevel !== key) return null;
        return (
          <div key={key} className="px-5 py-4">
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{meta.sub}</p>
            <ul className="flex flex-col gap-2.5">
              {items.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function MinistryAssistant({ signals }: Props) {
  const [role, setRole] = useState<LeaderRole | null>(null);
  const [context, setContext] = useState<MinistryContext>({});
  const [selectedSignalId, setSelectedSignalId] = useState('');
  const [output, setOutput] = useState<MinistryOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSignal = signals.find((s) => s.id === selectedSignalId) ?? null;
  const questions = role ? CONTEXT_QUESTIONS[role] : [];
  const canGenerate = role && selectedSignalId;

  const handleContextChange = (id: string, value: string) => {
    setContext((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (r: LeaderRole) => {
    setRole(r);
    setContext({});
    setOutput(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!role || !selectedSignal) return;
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch('/api/ministry-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, context, signal: selectedSignal }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setOutput(data.output as MinistryOutput);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Intro */}
      <div
        className="rounded-xl px-6 py-5"
        style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.12)' }}
      >
        <h2 className="text-base font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.9)' }}>
          Strategic Ministry Innovation Assistant
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Select your leadership role, describe your context, choose a signal of change — then generate
          targeted implications and practical responses across five spheres of ministry influence.
          Designed for a focused 3-minute thinking session.
        </p>
      </div>

      {/* Step 1 — Role */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <StepBadge n={1} active={!role} done={!!role} />
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Select your leadership role
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRoleChange(r.value)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
              style={{
                background: role === r.value ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${role === r.value ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.07)'}`,
                color: role === r.value ? 'rgba(249,115,22,0.8)' : 'rgba(255,255,255,0.3)',
              }}
            >
              <span className="flex-shrink-0">{ROLE_ICONS[r.value]}</span>
              <span
                className="text-sm font-medium leading-tight"
                style={{ color: role === r.value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}
              >
                {r.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Context */}
      {role && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <StepBadge
              n={2}
              active={!!role}
              done={Object.keys(context).length >= questions.length}
            />
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Describe your context <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional but improves relevance)</span>
            </span>
          </div>
          <div className="flex flex-col gap-3 pl-8">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {q.label}
                </label>
                {q.type === 'select' ? (
                  <select
                    value={context[q.id] || ''}
                    onChange={(e) => handleContextChange(q.id, e.target.value)}
                    className="rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: context[q.id] ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <option value="">— Select —</option>
                    {q.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={context[q.id] || ''}
                    onChange={(e) => handleContextChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Signal */}
      {role && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <StepBadge n={3} active={!!role} done={!!selectedSignalId} />
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Select a signal of change
            </span>
          </div>
          <div className="pl-8 flex flex-col gap-2">
            <select
              value={selectedSignalId}
              onChange={(e) => { setSelectedSignalId(e.target.value); setOutput(null); }}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: selectedSignalId ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
              }}
            >
              <option value="">— Choose a signal —</option>
              {signals.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}  [{s.disruption_level} · {s.maturity_stage}]
                </option>
              ))}
            </select>

            {selectedSignal && (
              <div
                className="rounded-lg px-4 py-3 mt-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {selectedSignal.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate button */}
      {canGenerate && (
        <div className="pl-8">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden"
            style={{
              background: loading
                ? 'rgba(249,115,22,0.2)'
                : 'linear-gradient(135deg, rgba(249,115,22,0.8), rgba(239,68,68,0.7))',
              color: loading ? 'rgba(255,255,255,0.5)' : 'white',
              border: '1px solid rgba(249,115,22,0.3)',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 20px rgba(249,115,22,0.2)',
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2.5">
                <svg className="animate-spin" width={14} height={14} viewBox="0 0 14 14">
                  <circle cx={7} cy={7} r={5.5} stroke="currentColor" strokeWidth={1.5} fill="none" strokeDasharray="22" strokeDashoffset="8" />
                </svg>
                Generating ministry insights…
              </span>
            ) : (
              `Generate Insights for ${ROLE_LABELS[role]}`
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-5 py-4"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(239,68,68,0.9)' }}>{error}</p>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="flex flex-col gap-5">
          {/* Output header */}
          <div
            className="rounded-xl px-5 py-4 flex items-start justify-between gap-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Ministry Implications — {selectedSignal?.title}
              </h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Role: {ROLE_LABELS[role!]} · {output.spheres.length} spheres · 3 response levels each
              </p>
            </div>
            <button
              onClick={() => { setOutput(null); }}
              className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Clear
            </button>
          </div>

          {/* Spheres */}
          {output.spheres.map((sphere, i) => (
            <SphereBlock key={i} sphere={sphere} index={i} />
          ))}

          {/* Discernment prompt */}
          <div
            className="rounded-xl px-5 py-4 mt-2"
            style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.1)' }}
          >
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(249,115,22,0.6)' }}>
              Invitation to Discernment
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Which of these responses resonates most with where you sense God calling you and your community?
              What would it mean to take one step in that direction this week? Consider sharing these reflections
              with a trusted colleague or team.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
