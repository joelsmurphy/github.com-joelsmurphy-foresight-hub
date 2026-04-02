'use client';

import { useState } from 'react';
import { Scenario, LeaderRole, StressTestResult } from '@/types';
import { ARCHETYPE_META } from '@/data/scenarioConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Props {
  scenarios: Scenario[];
  role: LeaderRole;
}

const RESILIENCE_META: Record<StressTestResult['resilience'], { label: string; color: string; bar: string; width: string }> = {
  strong:   { label: 'Resilient',        color: '#22c55e', bar: 'rgba(34,197,94,0.7)',   width: '90%' },
  moderate: { label: 'Mostly resilient', color: '#f59e0b', bar: 'rgba(245,158,11,0.7)',  width: '60%' },
  fragile:  { label: 'Fragile here',     color: '#f97316', bar: 'rgba(249,115,22,0.7)',  width: '35%' },
  breaks:   { label: 'Breaks down',      color: '#ef4444', bar: 'rgba(239,68,68,0.7)',   width: '15%' },
};

function ResilienceBar({ resilience, score }: { resilience: StressTestResult['resilience']; score: number }) {
  const meta = RESILIENCE_META[resilience];
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 6, background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: meta.bar }}
        />
      </div>
      <span className="flex-shrink-0 text-xs font-semibold" style={{ color: meta.color, minWidth: 110 }}>
        {meta.label}
      </span>
    </div>
  );
}

async function runStressTest(strategy: string, scenarios: Scenario[], role: LeaderRole): Promise<StressTestResult[]> {
  const res = await fetch('/api/stress-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strategy, scenarios, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unknown error');
  return data.results;
}

export default function StressTest({ scenarios, role }: Props) {
  const [strategy, setStrategy] = useState('');
  const [results, setResults] = useState<StressTestResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRun = strategy.trim().length > 20;

  const handleRun = async () => {
    if (!canRun) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const r = await runStressTest(strategy, scenarios, role);
      setResults(r);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-base font-bold mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>
          Stress Test Your Strategy
        </h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Describe your current direction or plan. The system will evaluate how it performs across each future.
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3 mb-5">
        <textarea
          value={strategy}
          onChange={e => setStrategy(e.target.value)}
          rows={5}
          placeholder={
            role === 'pastor'
              ? 'e.g. We are planning to hire an associate pastor, launch a young adults ministry, and begin a building renovation to expand our Sunday morning capacity…'
              : role === 'educator'
                ? 'e.g. We are transitioning our MDiv programme to a hybrid model, reducing residential requirements by 40%, and partnering with three denominations for field placements…'
                : 'e.g. We are launching a national leadership development initiative, expanding into two new regions, and restructuring our board to include more practitioner voices…'
          }
          className="rounded-xl px-4 py-3 text-sm outline-none resize-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            More detail = more useful results. 2–5 sentences is ideal.
          </p>
          <button
            onClick={handleRun}
            disabled={!canRun || loading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: !canRun || loading
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, rgba(249,115,22,0.8), rgba(239,68,68,0.7))',
              color: !canRun || loading ? 'rgba(255,255,255,0.25)' : 'white',
              border: !canRun || loading ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(249,115,22,0.3)',
              cursor: !canRun || loading ? 'not-allowed' : 'pointer',
              boxShadow: !canRun || loading ? 'none' : '0 0 16px rgba(249,115,22,0.2)',
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width={13} height={13} viewBox="0 0 14 14">
                  <circle cx={7} cy={7} r={5.5} stroke="currentColor" strokeWidth={1.5} fill="none" strokeDasharray="22" strokeDashoffset="8" />
                </svg>
                Testing…
              </span>
            ) : 'Test Against All Futures →'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-5 py-4 mb-5"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(239,68,68,0.9)' }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-4 fade-in">

          {/* Summary row */}
          <div
            className="rounded-xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Resilience Overview
            </p>
            <div className="flex flex-col gap-3">
              {results.map(r => {
                const archMeta = ARCHETYPE_META[r.archetype];
                return (
                  <div key={r.scenario_id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ color: archMeta.color }}>{archMeta.label}</span> · {r.scenario_title}
                      </span>
                    </div>
                    <ResilienceBar resilience={r.resilience} score={r.resilience_score} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail cards */}
          {results.map(r => {
            const archMeta = ARCHETYPE_META[r.archetype];
            const resMeta = RESILIENCE_META[r.resilience];
            return (
              <div
                key={r.scenario_id}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${archMeta.border}`, background: archMeta.bg }}
              >
                {/* Header */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full uppercase"
                      style={{ background: archMeta.bg, color: archMeta.color, border: `1px solid ${archMeta.border}` }}
                    >
                      {archMeta.label}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {r.scenario_title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: resMeta.color }}>
                    {resMeta.label}
                  </span>
                </div>

                <div className="px-5 py-4 flex flex-col gap-4">

                  {/* Strengths */}
                  {r.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#22c55e' }}>
                        Where it holds
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {r.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }}>✓</span>
                            <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Vulnerabilities */}
                  {r.vulnerabilities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: resMeta.color }}>
                        Where it is fragile
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {r.vulnerabilities.map((v, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: resMeta.color }}>!</span>
                            <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Adaptations */}
                  {r.adaptations.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(249,115,22,0.7)' }}>
                        How to adapt
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {r.adaptations.map((a, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: 'rgba(249,115,22,0.7)' }}>→</span>
                            <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
