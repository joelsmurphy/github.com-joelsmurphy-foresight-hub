'use client';

import { Scenario } from '@/types';
import { ARCHETYPE_META, TONE_META } from '@/data/scenarioConfig';

interface Props {
  scenarios: Scenario[];
}

const COMPARISON_ROWS: { label: string; key: keyof Scenario | 'core_assumption' | 'key_risk' | 'key_opportunity' | 'what_breaks' }[] = [
  { label: 'Archetype', key: 'archetype' },
  { label: 'Emotional tone', key: 'emotional_tone' },
  { label: 'Key drivers', key: 'key_drivers' },
  { label: 'Core assumption', key: 'core_assumption' },
  { label: 'Key risk', key: 'key_risk' },
  { label: 'Key opportunity', key: 'key_opportunity' },
  { label: 'What could break', key: 'what_breaks' },
  { label: 'Faithful responses', key: 'faithful_responses' },
];

function getCoreAssumption(s: Scenario): string {
  // Derive from archetype
  const assumptions: Record<string, string> = {
    growth: 'The church has the adaptive capacity to meet new challenges and flourish',
    collapse: 'Current institutional structures cannot absorb the accumulated pressures',
    discipline: 'A forcing constraint will make decisions that leaders have deferred',
    transformation: 'The Spirit is at work through disruption, calling the church into new forms',
  };
  return assumptions[s.archetype] ?? '—';
}

function getKeyRisk(s: Scenario): string {
  // First driver + negative framing
  return s.key_drivers[0]
    ? `Underestimating the speed and depth of ${s.key_drivers[0].toLowerCase()}`
    : '—';
}

function getKeyOpportunity(s: Scenario): string {
  const opps: Record<string, string> = {
    growth: 'Scale what is working before the window closes',
    collapse: 'Build new, lighter structures free from legacy constraints',
    discipline: 'Rediscover core mission when surplus no longer masks drift',
    transformation: 'Become something truer to the gospel than current forms allow',
  };
  return opps[s.archetype] ?? '—';
}

function getWhatBreaks(s: Scenario): string {
  const breaks: Record<string, string> = {
    growth: 'Strategies built on scarcity assumptions; pessimism about the church\'s future',
    collapse: 'Long-term capital investments, staffing models, denominational structures',
    discipline: 'Growth plans, hiring pipelines, building programmes',
    transformation: 'Any strategy assuming the current form of church remains recognizable',
  };
  return breaks[s.archetype] ?? '—';
}

function CellContent({ scenario, rowKey }: { scenario: Scenario; rowKey: string }) {
  const archMeta = ARCHETYPE_META[scenario.archetype];

  if (rowKey === 'archetype') {
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
        style={{ background: archMeta.bg, color: archMeta.color, border: `1px solid ${archMeta.border}` }}
      >
        {archMeta.label}
      </span>
    );
  }

  if (rowKey === 'emotional_tone') {
    const toneMeta = TONE_META[scenario.emotional_tone] ?? { label: scenario.emotional_tone, color: '#94a3b8' };
    return (
      <span className="text-xs font-medium" style={{ color: toneMeta.color }}>
        {toneMeta.label}
      </span>
    );
  }

  if (rowKey === 'key_drivers') {
    return (
      <ul className="flex flex-col gap-1.5">
        {scenario.key_drivers.slice(0, 3).map((d, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: archMeta.color }} />
            <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{d}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (rowKey === 'faithful_responses') {
    return (
      <ul className="flex flex-col gap-1.5">
        {scenario.faithful_responses.slice(0, 2).map((r, i) => (
          <li key={i} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            → {r}
          </li>
        ))}
      </ul>
    );
  }

  // Derived fields
  const derivedMap: Record<string, string> = {
    core_assumption: getCoreAssumption(scenario),
    key_risk: getKeyRisk(scenario),
    key_opportunity: getKeyOpportunity(scenario),
    what_breaks: getWhatBreaks(scenario),
  };
  if (rowKey in derivedMap) {
    return (
      <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {derivedMap[rowKey]}
      </span>
    );
  }

  return null;
}

export default function ScenarioComparison({ scenarios }: Props) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-base font-bold mb-1" style={{ color: 'rgba(255,255,255,0.88)' }}>
          Compare Futures
        </h3>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Key differences across your {scenarios.length} scenarios
        </p>
      </div>

      {/* Scroll container */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: scenarios.length * 200 + 160 }}>
          <thead>
            <tr>
              <th
                className="text-left py-3 pr-4 text-xs font-semibold uppercase tracking-widest w-36"
                style={{ color: 'rgba(255,255,255,0.25)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                Dimension
              </th>
              {scenarios.map(s => {
                const archMeta = ARCHETYPE_META[s.archetype];
                return (
                  <th
                    key={s.id}
                    className="text-left py-3 px-3 text-xs font-bold"
                    style={{
                      borderBottom: `2px solid ${archMeta.color}`,
                      color: archMeta.color,
                      minWidth: 180,
                    }}
                  >
                    <span className="block text-xs font-normal mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {archMeta.label}
                    </span>
                    {s.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map(({ label, key }) => (
              <tr
                key={key}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <td
                  className="py-3 pr-4 text-xs font-semibold align-top"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {label}
                </td>
                {scenarios.map(s => (
                  <td key={s.id} className="py-3 px-3 align-top">
                    <CellContent scenario={s} rowKey={key} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom note */}
      <div
        className="rounded-xl px-5 py-4 mt-6"
        style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.1)' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(249,115,22,0.55)' }}>
          A question for comparison
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Which of these futures feels most plausible from where you stand today? Which feels most
          threatening — and which reveals an unexpected gift? Resist the urge to dismiss any of them.
          The future that unsettles you most may be the one most worth preparing for.
        </p>
      </div>
    </div>
  );
}
