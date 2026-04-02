'use client';

import { Signal } from '@/types';

const DISRUPTION_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  incremental:   { text: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)' },
  substantive:   { text: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  transformative:{ text: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)' },
};

const STAGE_LABELS: Record<string, string> = {
  emerging:    'Emerging  ·  0–3 years',
  scaling:     'Scaling  ·  3–7 years',
  established: 'Established  ·  7–15 years',
  structural:  'Structural  ·  15+ years',
};

const ZONE_LABELS: Record<string, string> = {
  innovation: 'Innovation Zone',
  reactive:   'Reactive Zone',
  active:     'Active Zone',
  action:     'Action Zone',
};

interface Props {
  signal: Signal;
  onClose: () => void;
}

function Badge({ label, color }: { label: string; color: { text: string; bg: string; border: string } }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide"
      style={{ color: color.text, background: color.bg, border: `1px solid ${color.border}` }}
    >
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{value}</span>
    </div>
  );
}

export default function SignalCard({ signal, onClose }: Props) {
  const dc = DISRUPTION_COLORS[signal.disruption_level];

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        background: '#0d0d1f',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-start justify-between gap-3 px-5 py-4 sticky top-0 z-10"
        style={{
          background: '#0d0d1f',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          borderLeft: `3px solid ${dc.text}`,
        }}
      >
        <div className="flex flex-col gap-1.5 min-w-0">
          <h2 className="text-base font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
            {signal.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              label={signal.disruption_level.charAt(0).toUpperCase() + signal.disruption_level.slice(1)}
              color={dc}
            />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {STAGE_LABELS[signal.maturity_stage]}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label="Close"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-5 py-5">

        {/* Description */}
        <div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {signal.description}
          </p>
        </div>

        {/* Key metadata grid */}
        <div
          className="grid grid-cols-2 gap-3 rounded-lg p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Row label="Zone" value={ZONE_LABELS[signal.zone]} />
          <Row label="Stage" value={STAGE_LABELS[signal.maturity_stage].split('·')[0].trim()} />
          <Row label="Disruption" value={signal.disruption_level.charAt(0).toUpperCase() + signal.disruption_level.slice(1)} />
          {signal.time_horizon && <Row label="Time Horizon" value={signal.time_horizon} />}
          {signal.domain && <Row label="Domain" value={signal.domain} />}
          {signal.confidence_level && <Row label="Confidence" value={signal.confidence_level} />}
          {signal.date_observed && <Row label="Observed" value={signal.date_observed} />}
        </div>

        {/* Sources */}
        {signal.sources.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Sources
            </span>
            <ul className="flex flex-col gap-1.5">
              {signal.sources.map((src, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color: dc.text, marginTop: 2 }}>▸</span>
                  {src}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {signal.notes && (
          <div
            className="rounded-lg px-4 py-3"
            style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.12)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest block mb-1.5"
              style={{ color: 'rgba(249,115,22,0.6)' }}>
              Analyst Note
            </span>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {signal.notes}
            </p>
          </div>
        )}

        {/* Related signals */}
        {signal.related_signals && signal.related_signals.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest block mb-1.5"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Related Signals
            </span>
            <div className="flex flex-wrap gap-1.5">
              {signal.related_signals.map((id) => (
                <span key={id} className="text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Signal ID footer */}
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {signal.id}
          </span>
        </div>
      </div>
    </div>
  );
}
