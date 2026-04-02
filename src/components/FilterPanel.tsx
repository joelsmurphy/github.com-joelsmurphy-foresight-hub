'use client';

import { FilterState, DisruptionLevel, MaturityStage } from '@/types';

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  signalCount: number;
  visibleCount: number;
}

const DISRUPTION_OPTIONS: { value: DisruptionLevel; label: string; color: string }[] = [
  { value: 'incremental',   label: 'Incremental',   color: '#22c55e' },
  { value: 'substantive',   label: 'Substantive',   color: '#f97316' },
  { value: 'transformative',label: 'Transformative',color: '#ef4444' },
];

const STAGE_OPTIONS: { value: MaturityStage; label: string; sub: string }[] = [
  { value: 'emerging',    label: 'Emerging',    sub: '0–3 yrs' },
  { value: 'scaling',     label: 'Scaling',     sub: '3–7 yrs' },
  { value: 'established', label: 'Established', sub: '7–15 yrs' },
  { value: 'structural',  label: 'Structural',  sub: '15+ yrs' },
];

function ToggleChip<T extends string>({
  value,
  active,
  label,
  sub,
  color,
  onToggle,
}: {
  value: T;
  active: boolean;
  label: string;
  sub?: string;
  color?: string;
  onToggle: (v: T) => void;
}) {
  return (
    <button
      onClick={() => onToggle(value)}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all"
      style={{
        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
        border: `1px solid ${active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
        opacity: active ? 1 : 0.45,
      }}
    >
      {color && (
        <span
          className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
          style={{ background: color, boxShadow: active ? `0 0 6px ${color}` : 'none' }}
        />
      )}
      <span className="flex flex-col min-w-0">
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
        {sub && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</span>}
      </span>
      {active && (
        <span className="ml-auto flex-shrink-0 w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center">
          <svg width={8} height={8} viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" /></svg>
        </span>
      )}
    </button>
  );
}

export default function FilterPanel({ filters, onChange, signalCount, visibleCount }: Props) {
  const toggleDisruption = (val: DisruptionLevel) => {
    const next = new Set(filters.disruption);
    next.has(val) ? next.delete(val) : next.add(val);
    onChange({ ...filters, disruption: next });
  };

  const toggleStage = (val: MaturityStage) => {
    const next = new Set(filters.stage);
    next.has(val) ? next.delete(val) : next.add(val);
    onChange({ ...filters, stage: next });
  };

  const resetAll = () =>
    onChange({
      disruption: new Set<DisruptionLevel>(['incremental', 'substantive', 'transformative']),
      stage: new Set<MaturityStage>(['emerging', 'scaling', 'established', 'structural']),
      showLabels: filters.showLabels,
    });

  const allActive =
    filters.disruption.size === 3 && filters.stage.size === 4;

  return (
    <div
      className="flex flex-col gap-5 rounded-xl p-4 h-fit"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        minWidth: 180,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Filters
        </span>
        {!allActive && (
          <button
            onClick={resetAll}
            className="text-xs px-2 py-0.5 rounded transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Signal count */}
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Showing <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{visibleCount}</span> of {signalCount} signals
      </div>

      {/* Disruption level */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Disruption Level
        </span>
        {DISRUPTION_OPTIONS.map((opt) => (
          <ToggleChip
            key={opt.value}
            value={opt.value}
            active={filters.disruption.has(opt.value)}
            label={opt.label}
            color={opt.color}
            onToggle={toggleDisruption}
          />
        ))}
      </div>

      {/* Maturity stage */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Maturity Stage
        </span>
        {STAGE_OPTIONS.map((opt) => (
          <ToggleChip
            key={opt.value}
            value={opt.value}
            active={filters.stage.has(opt.value)}
            label={opt.label}
            sub={opt.sub}
            onToggle={toggleStage}
          />
        ))}
      </div>

      {/* Label toggle */}
      <div className="flex flex-col gap-1.5 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onChange({ ...filters, showLabels: !filters.showLabels })}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-all"
          style={{
            background: filters.showLabels ? 'rgba(255,255,255,0.07)' : 'transparent',
            border: `1px solid ${filters.showLabels ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`,
          }}
        >
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <rect x={1} y={4} width={12} height={6} rx={1.5}
              stroke={filters.showLabels ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}
              strokeWidth={1.3}
            />
            <path d="M4 7h6M4 7v0" stroke={filters.showLabels ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}
              strokeWidth={1.3} strokeLinecap="round" />
          </svg>
          <span className="text-xs font-medium" style={{ color: filters.showLabels ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}>
            Signal Labels
          </span>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Legend
        </span>
        <div className="flex items-center gap-2">
          <svg width={24} height={6}>
            <line x1={0} y1={3} x2={24} y2={3} stroke="#f97316" strokeWidth={2} />
          </svg>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>S-Curve trajectory</span>
        </div>
        {DISRUPTION_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: opt.color }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
