'use client';

import { useState } from 'react';
import {
  LeaderRole, ScenarioInputs, Scenario, DatorArchetype, ChangeScope, MinistryContext,
} from '@/types';
import { SAMPLE_SIGNALS, CONTEXT_QUESTIONS, ROLE_LABELS } from '@/data/signals';
import {
  ARCHETYPE_META, DISRUPTION_LABELS, SPEED_LABELS, SCOPE_LABELS,
} from '@/data/scenarioConfig';
import ScenarioCard from './ScenarioCard';
import ScenarioComparison from './ScenarioComparison';
import StressTest from './StressTest';

// ── Types ─────────────────────────────────────────────────────────────────────

type WizardStep = 'role' | 'context' | 'concerns' | 'parameters' | 'generating' | 'results';
type ResultView = 'cards' | 'compare' | 'stresstest';

const ROLES: { value: LeaderRole; label: string; sub: string }[] = [
  { value: 'pastor',         label: 'Pastor',                      sub: 'Local congregation · preaching · discipleship · community' },
  { value: 'educator',       label: 'Theological Educator',        sub: 'Seminary · Bible college · formation · curriculum' },
  { value: 'denominational', label: 'Christian Org Leader',        sub: 'Denomination · para-church · mission agency · strategy' },
];

const ALL_ARCHETYPES: DatorArchetype[] = ['growth', 'collapse', 'discipline', 'transformation'];
const ALL_SCOPES: ChangeScope[] = ['local', 'regional', 'national', 'ecclesial', 'global'];

const LOADING_PHRASES = [
  'Mapping possible futures…',
  'Following the signals forward…',
  'Building causal pathways…',
  'Stress-testing assumptions…',
  'Surfacing surprises…',
  'Shaping your scenarios…',
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StepDots({ step }: { step: WizardStep }) {
  const steps: WizardStep[] = ['role', 'context', 'concerns', 'parameters'];
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {steps.map((s, i) => {
        const stepIndex = steps.indexOf(step);
        const done = i < stepIndex;
        const active = s === step;
        return (
          <span
            key={s}
            className="rounded-full transition-all"
            style={{
              width: active ? 20 : 8,
              height: 8,
              background: done
                ? 'rgba(249,115,22,0.5)'
                : active
                  ? 'rgba(249,115,22,0.9)'
                  : 'rgba(255,255,255,0.1)',
            }}
          />
        );
      })}
    </div>
  );
}

function NavButtons({
  onBack, onNext, nextLabel, nextDisabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8">
      {onBack ? (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          ← Back
        </button>
      ) : <span />}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background: nextDisabled
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, rgba(249,115,22,0.8), rgba(239,68,68,0.7))',
          color: nextDisabled ? 'rgba(255,255,255,0.25)' : 'white',
          border: nextDisabled ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(249,115,22,0.3)',
          cursor: nextDisabled ? 'not-allowed' : 'pointer',
          boxShadow: nextDisabled ? 'none' : '0 0 16px rgba(249,115,22,0.2)',
        }}
      >
        {nextLabel ?? 'Continue →'}
      </button>
    </div>
  );
}

// ── Step: Role ────────────────────────────────────────────────────────────────

function RoleStep({
  selected, onSelect,
}: { selected: LeaderRole | null; onSelect: (r: LeaderRole) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.92)' }}>
        Where are you standing?
      </h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Your vantage point shapes every future you'll explore.
      </p>
      <div className="flex flex-col gap-3">
        {ROLES.map(r => (
          <button
            key={r.value}
            onClick={() => onSelect(r.value)}
            className="text-left px-5 py-4 rounded-xl transition-all"
            style={{
              background: selected === r.value ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${selected === r.value ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span
              className="text-sm font-bold block mb-0.5"
              style={{ color: selected === r.value ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)' }}
            >
              {r.label}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step: Context ─────────────────────────────────────────────────────────────

function ContextStep({
  role, context, onChange,
}: { role: LeaderRole; context: MinistryContext; onChange: (id: string, val: string) => void }) {
  const questions = CONTEXT_QUESTIONS[role] ?? [];
  return (
    <div>
      <h2 className="text-xl font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.92)' }}>
        Describe your world
      </h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Context shapes which futures are relevant. All fields are optional.
      </p>
      <div className="flex flex-col gap-4">
        {questions.map(q => (
          <div key={q.id} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {q.label}
            </label>
            {q.type === 'select' ? (
              <select
                value={context[q.id] ?? ''}
                onChange={e => onChange(q.id, e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: context[q.id] ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                }}
              >
                <option value="">— Select —</option>
                {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type="text"
                value={context[q.id] ?? ''}
                onChange={e => onChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                className="rounded-lg px-3 py-2 text-sm outline-none"
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
  );
}

// ── Step: Concerns ────────────────────────────────────────────────────────────

const DOMAIN_GROUPS: Record<string, string[]> = {};
SAMPLE_SIGNALS.forEach(s => {
  const domain = s.domain ?? 'Other';
  if (!DOMAIN_GROUPS[domain]) DOMAIN_GROUPS[domain] = [];
  DOMAIN_GROUPS[domain].push(s.id);
});

function ConcernsStep({
  selected, custom, onToggle, onCustomChange,
}: {
  selected: string[];
  custom: string[];
  onToggle: (id: string) => void;
  onCustomChange: (items: string[]) => void;
}) {
  const [customInput, setCustomInput] = useState('');

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !custom.includes(trimmed)) {
      onCustomChange([...custom, trimmed]);
    }
    setCustomInput('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.92)' }}>
        What forces concern you most?
      </h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Select 2–5 signals. These anchor the futures you'll explore.
      </p>

      {/* Signal chips by domain */}
      <div className="flex flex-col gap-4 mb-5">
        {Object.entries(DOMAIN_GROUPS).map(([domain, ids]) => (
          <div key={domain}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {domain}
            </p>
            <div className="flex flex-wrap gap-2">
              {ids.map(id => {
                const sig = SAMPLE_SIGNALS.find(s => s.id === id)!;
                const isSelected = selected.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => onToggle(id)}
                    title={sig.description}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: isSelected ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isSelected ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      color: isSelected ? 'rgba(249,115,22,0.95)' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {sig.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom concern */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Add your own
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="e.g. Rapid decline in baptisms, Political polarization in congregation…"
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
            }}
          />
          <button
            onClick={addCustom}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: 'rgba(249,115,22,0.9)',
            }}
          >
            Add
          </button>
        </div>
        {custom.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {custom.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  color: 'rgba(249,115,22,0.85)',
                }}
              >
                {item}
                <button
                  onClick={() => onCustomChange(custom.filter((_, j) => j !== i))}
                  style={{ color: 'rgba(249,115,22,0.5)' }}
                >×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {selected.length} signal{selected.length !== 1 ? 's' : ''} selected
          {custom.length > 0 ? ` + ${custom.length} custom concern${custom.length !== 1 ? 's' : ''}` : ''}
        </p>
      )}
    </div>
  );
}

// ── Step: Parameters ──────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, onChange, leftLabel, rightLabel,
}: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; leftLabel: string; rightLabel: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
        style={{ accentColor: 'rgba(249,115,22,0.9)' }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{leftLabel}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{rightLabel}</span>
      </div>
    </div>
  );
}

function ParametersStep({
  disruptionDegree, changeSpeed, scope, archetypes,
  onDisruption, onSpeed, onScope, onArchetypes,
}: {
  disruptionDegree: number; changeSpeed: number; scope: ChangeScope;
  archetypes: DatorArchetype[];
  onDisruption: (v: number) => void; onSpeed: (v: number) => void;
  onScope: (v: ChangeScope) => void; onArchetypes: (a: DatorArchetype[]) => void;
}) {
  const toggleArchetype = (a: DatorArchetype) => {
    if (archetypes.includes(a)) {
      if (archetypes.length > 1) onArchetypes(archetypes.filter(x => x !== a));
    } else {
      onArchetypes([...archetypes, a]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.92)' }}>
        Shape your horizon
      </h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Tune the futures you'll encounter.
      </p>

      <div className="flex flex-col gap-6">

        {/* Sliders */}
        <div
          className="rounded-xl px-5 py-5 flex flex-col gap-5"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Slider
            label={`How much change? — ${DISRUPTION_LABELS[disruptionDegree]}`}
            value={disruptionDegree} min={1} max={5}
            onChange={onDisruption}
            leftLabel="Gentle drift" rightLabel="Fundamental rupture"
          />
          <Slider
            label={`How fast? — ${SPEED_LABELS[changeSpeed]}`}
            value={changeSpeed} min={1} max={5}
            onChange={onSpeed}
            leftLabel="Generational" rightLabel="Within a decade"
          />
        </div>

        {/* Scope */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Scope
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_SCOPES.map(s => (
              <button
                key={s}
                onClick={() => onScope(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: scope === s ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${scope === s ? 'rgba(249,115,22,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: scope === s ? 'rgba(249,115,22,0.95)' : 'rgba(255,255,255,0.45)',
                }}
              >
                {SCOPE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Archetypes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Futures to explore
          </p>
          <p className="text-xs mb-2.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Uncheck any you want to exclude. At least one required.
          </p>
          <div className="flex flex-col gap-2">
            {ALL_ARCHETYPES.map(a => {
              const meta = ARCHETYPE_META[a];
              const active = archetypes.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleArchetype(a)}
                  className="flex items-start gap-3 text-left px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: active ? meta.bg : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${active ? meta.border : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded mt-0.5 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: active ? meta.bg : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${active ? meta.color : 'rgba(255,255,255,0.15)'}`,
                      color: meta.color,
                    }}
                  >
                    {active ? '✓' : ''}
                  </span>
                  <div>
                    <span className="text-sm font-semibold block" style={{ color: active ? meta.color : 'rgba(255,255,255,0.45)' }}>
                      {meta.label}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {meta.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Generating state ──────────────────────────────────────────────────────────

function GeneratingState({ phraseIndex }: { phraseIndex: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
      >
        <svg className="animate-spin" width={20} height={20} viewBox="0 0 20 20">
          <circle cx={10} cy={10} r={8} stroke="rgba(249,115,22,0.3)" strokeWidth={2} fill="none" />
          <circle cx={10} cy={10} r={8} stroke="rgba(249,115,22,0.9)" strokeWidth={2} fill="none"
            strokeDasharray="32" strokeDashoffset="20" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {LOADING_PHRASES[phraseIndex % LOADING_PHRASES.length]}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
          This takes 15–30 seconds
        </p>
      </div>
    </div>
  );
}

// ── Results toolbar ───────────────────────────────────────────────────────────

function ResultsToolbar({
  view, onView, onReset, role, scenarioCount,
}: {
  view: ResultView; onView: (v: ResultView) => void;
  onReset: () => void; role: LeaderRole; scenarioCount: number;
}) {
  const views: { id: ResultView; label: string }[] = [
    { id: 'cards', label: 'Scenarios' },
    { id: 'compare', label: 'Compare' },
    { id: 'stresstest', label: 'Stress Test' },
  ];
  return (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {scenarioCount} futures · {ROLE_LABELS[role]}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <nav
          className="flex rounded-xl p-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => onView(v.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: view === v.id ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: view === v.id ? 'rgba(249,115,22,0.95)' : 'rgba(255,255,255,0.35)',
                border: view === v.id ? '1px solid rgba(249,115,22,0.25)' : '1px solid transparent',
              }}
            >
              {v.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ScenarioGenerator() {
  const [step, setStep] = useState<WizardStep>('role');
  const [role, setRole] = useState<LeaderRole | null>(null);
  const [context, setContext] = useState<MinistryContext>({});
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [customConcerns, setCustomConcerns] = useState<string[]>([]);
  const [disruptionDegree, setDisruptionDegree] = useState(3);
  const [changeSpeed, setChangeSpeed] = useState(3);
  const [scope, setScope] = useState<ChangeScope>('regional');
  const [archetypes, setArchetypes] = useState<DatorArchetype[]>([...ALL_ARCHETYPES]);
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [view, setView] = useState<ResultView>('cards');

  const toggleSignal = (id: string) => {
    setSelectedSignals(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleContextChange = (id: string, val: string) => {
    setContext(prev => ({ ...prev, [id]: val }));
  };

  const generate = async () => {
    if (!role) return;
    setStep('generating');
    setLoading(true);
    setError(null);

    // Cycle loading phrases
    const interval = setInterval(() => setPhraseIndex(i => i + 1), 4000);

    const inputs: ScenarioInputs = {
      role,
      context,
      selected_signals: selectedSignals,
      custom_concerns: customConcerns,
      disruption_degree: disruptionDegree as ScenarioInputs['disruption_degree'],
      change_speed: changeSpeed as ScenarioInputs['change_speed'],
      scope,
      archetypes_enabled: archetypes,
    };

    try {
      const res = await fetch('/api/scenario-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setScenarios(data.scenarios);
      setStep('results');
      setView('cards');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setStep('parameters');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('role');
    setRole(null);
    setContext({});
    setSelectedSignals([]);
    setCustomConcerns([]);
    setDisruptionDegree(3);
    setChangeSpeed(3);
    setScope('regional');
    setArchetypes([...ALL_ARCHETYPES]);
    setScenarios(null);
    setError(null);
    setPhraseIndex(0);
    setView('cards');
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Intro banner */}
      {step === 'role' && (
        <div
          className="rounded-xl px-6 py-5 mb-8"
          style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.12)' }}
        >
          <h2 className="text-base font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Futures Scenario Generator
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            An exploratory foresight journey for Christian leaders. Generate 3–4 plausible, distinct futures
            grounded in real signals of change — then reflect, compare, and discern faithful responses.
            This is not prediction. It is imagination in service of wisdom.
          </p>
        </div>
      )}

      {/* Step dots */}
      {!['generating', 'results'].includes(step) && <StepDots step={step} />}

      {/* Step content */}
      <div className="fade-in">

        {step === 'role' && (
          <>
            <RoleStep selected={role} onSelect={r => { setRole(r); setContext({}); }} />
            <NavButtons
              onNext={() => setStep('context')}
              nextDisabled={!role}
            />
          </>
        )}

        {step === 'context' && role && (
          <>
            <ContextStep role={role} context={context} onChange={handleContextChange} />
            <NavButtons
              onBack={() => setStep('role')}
              onNext={() => setStep('concerns')}
            />
          </>
        )}

        {step === 'concerns' && (
          <>
            <ConcernsStep
              selected={selectedSignals}
              custom={customConcerns}
              onToggle={toggleSignal}
              onCustomChange={setCustomConcerns}
            />
            <NavButtons
              onBack={() => setStep('context')}
              onNext={() => setStep('parameters')}
              nextDisabled={selectedSignals.length === 0 && customConcerns.length === 0}
            />
          </>
        )}

        {step === 'parameters' && (
          <>
            <ParametersStep
              disruptionDegree={disruptionDegree}
              changeSpeed={changeSpeed}
              scope={scope}
              archetypes={archetypes}
              onDisruption={setDisruptionDegree}
              onSpeed={setChangeSpeed}
              onScope={setScope}
              onArchetypes={setArchetypes}
            />
            {error && (
              <div
                className="rounded-xl px-5 py-4 mt-4"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <p className="text-sm" style={{ color: 'rgba(239,68,68,0.9)' }}>{error}</p>
              </div>
            )}
            <NavButtons
              onBack={() => setStep('concerns')}
              onNext={generate}
              nextLabel="Generate Scenarios →"
              nextDisabled={loading || archetypes.length === 0}
            />
          </>
        )}

        {step === 'generating' && <GeneratingState phraseIndex={phraseIndex} />}

        {step === 'results' && scenarios && role && (
          <>
            <ResultsToolbar
              view={view}
              onView={setView}
              onReset={reset}
              role={role}
              scenarioCount={scenarios.length}
            />
            {view === 'cards' && (
              <div className="flex flex-col gap-4">
                {scenarios.map((s, i) => (
                  <ScenarioCard key={s.id} scenario={s} activeRole={role} index={i} />
                ))}
              </div>
            )}
            {view === 'compare' && <ScenarioComparison scenarios={scenarios} />}
            {view === 'stresstest' && <StressTest scenarios={scenarios} role={role} />}
          </>
        )}

      </div>
    </div>
  );
}
