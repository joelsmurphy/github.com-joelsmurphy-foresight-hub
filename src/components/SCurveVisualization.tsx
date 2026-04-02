'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Signal, FilterState } from '@/types';

interface Props {
  signals: Signal[];
  filters: FilterState;
  selectedSignal: Signal | null;
  onSignalClick: (signal: Signal) => void;
}

// --- Layout constants (viewBox coordinates) ---
const VB_W = 1060;
const VB_H = 540;
const PAD = { top: 80, right: 50, bottom: 70, left: 90 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;

const ZONES = [
  { id: 'innovation', label: 'Innovation Zone', sub: 'Emerging · 0–3 yrs', color: 'rgba(99,102,241,0.07)' },
  { id: 'reactive',   label: 'Reactive Zone',   sub: 'Scaling · 3–7 yrs',  color: 'rgba(139,92,246,0.07)' },
  { id: 'active',     label: 'Active Zone',      sub: 'Established · 7–15 yrs', color: 'rgba(236,72,153,0.06)' },
  { id: 'action',     label: 'Action Zone',      sub: 'Structural · 15+ yrs',   color: 'rgba(249,115,22,0.07)' },
];

const DISRUPTION_COLORS: Record<string, string> = {
  incremental:  '#22c55e',
  substantive:  '#f97316',
  transformative: '#ef4444',
};

// Sigmoid: y_norm = 1 / (1 + e^(-10*(t-0.5))), t ∈ [0,1]
function sigmoid(t: number): number {
  return 1 / (1 + Math.exp(-10 * (t - 0.5)));
}

function buildCurvePath(): string {
  const pts: string[] = [];
  for (let i = 0; i <= 300; i++) {
    const t = i / 300;
    const x = PAD.left + t * PLOT_W;
    const y = PAD.top + PLOT_H * (1 - sigmoid(t));
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

function signalToSVG(signal: Signal): { x: number; y: number } {
  return {
    x: PAD.left + (signal.x_position / 100) * PLOT_W,
    y: PAD.top + PLOT_H * (1 - signal.y_position / 100),
  };
}

// Simple iterative label collision avoidance (y-axis only)
interface LabelLayout {
  id: string;
  x: number;
  y: number;
  anchor: 'start' | 'end';
}

function computeLabelLayouts(signals: Signal[]): Map<string, LabelLayout> {
  const CHAR_W = 6.5;
  const LINE_H = 14;
  const DOT_R = 7;
  const GAP = 5;

  // Initial placement
  const layouts: LabelLayout[] = signals.map((s) => {
    const { x, y } = signalToSVG(s);
    const textLen = s.title.length * CHAR_W;
    const anchor: 'start' | 'end' = x + GAP + textLen > VB_W - PAD.right + 10 ? 'end' : 'start';
    return {
      id: s.id,
      x: anchor === 'start' ? x + DOT_R + GAP : x - DOT_R - GAP,
      y: y + LINE_H / 3,
      anchor,
    };
  });

  // Push overlapping labels apart (y-axis)
  for (let iter = 0; iter < 60; iter++) {
    let moved = false;
    for (let i = 0; i < layouts.length; i++) {
      for (let j = i + 1; j < layouts.length; j++) {
        const a = layouts[i];
        const b = layouts[j];
        const dy = Math.abs(a.y - b.y);
        if (dy < LINE_H + 2) {
          const push = (LINE_H + 3 - dy) / 2;
          if (a.y <= b.y) {
            a.y -= push;
            b.y += push;
          } else {
            a.y += push;
            b.y -= push;
          }
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  const map = new Map<string, LabelLayout>();
  layouts.forEach((l) => map.set(l.id, l));
  return map;
}

interface TooltipState {
  signal: Signal;
  svgX: number;
  svgY: number;
}

const CURVE_PATH = buildCurvePath();

export default function SCurveVisualization({ signals, filters, selectedSignal, onSignalClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const visible = signals.filter(
    (s) => filters.disruption.has(s.disruption_level) && filters.stage.has(s.maturity_stage),
  );

  const labelLayouts = computeLabelLayouts(visible);

  const handleMouseEnter = useCallback((e: React.MouseEvent, signal: Signal) => {
    const { x, y } = signalToSVG(signal);
    setTooltip({ signal, svgX: x, svgY: y });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // Close tooltip if selected signal changes
  useEffect(() => { setTooltip(null); }, [selectedSignal]);

  return (
    <div className="w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto"
        style={{ background: 'transparent' }}
      >
        <defs>
          {/* S-curve glow */}
          <filter id="curve-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Dot glow */}
          <filter id="dot-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Selected dot glow */}
          <filter id="dot-glow-sel" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Zone bands ── */}
        {ZONES.map((z, i) => {
          const zx = PAD.left + i * (PLOT_W / 4);
          const zw = PLOT_W / 4;
          return (
            <g key={z.id}>
              <rect x={zx} y={PAD.top} width={zw} height={PLOT_H} fill={z.color} />
              {/* Divider line */}
              {i > 0 && (
                <line
                  x1={zx} y1={PAD.top}
                  x2={zx} y2={PAD.top + PLOT_H}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              )}
              {/* Zone label */}
              <text
                x={zx + zw / 2}
                y={PAD.top - 32}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                fill="rgba(255,255,255,0.75)"
                fontFamily="system-ui,sans-serif"
              >
                {z.label}
              </text>
              <text
                x={zx + zw / 2}
                y={PAD.top - 16}
                textAnchor="middle"
                fontSize={10}
                fill="rgba(255,255,255,0.35)"
                fontFamily="system-ui,sans-serif"
              >
                {z.sub}
              </text>
            </g>
          );
        })}

        {/* ── Axes ── */}
        {/* Y-axis */}
        <line
          x1={PAD.left} y1={PAD.top}
          x2={PAD.left} y2={PAD.top + PLOT_H}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1}
        />
        {/* X-axis */}
        <line
          x1={PAD.left} y1={PAD.top + PLOT_H}
          x2={PAD.left + PLOT_W} y2={PAD.top + PLOT_H}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1}
        />

        {/* Y-axis label */}
        <text
          x={22}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={11}
          fill="rgba(255,255,255,0.4)"
          fontFamily="system-ui,sans-serif"
          transform={`rotate(-90, 22, ${PAD.top + PLOT_H / 2})`}
        >
          Impact / Adoption Level
        </text>

        {/* Y-axis tick labels */}
        {['High', 'Medium', 'Low'].map((label, i) => {
          const ty = PAD.top + (i / 2) * PLOT_H;
          return (
            <text key={label} x={PAD.left - 8} y={ty + 4} textAnchor="end"
              fontSize={9} fill="rgba(255,255,255,0.25)" fontFamily="system-ui,sans-serif">
              {label}
            </text>
          );
        })}

        {/* X-axis arrow cap */}
        <polygon
          points={`${PAD.left + PLOT_W},${PAD.top + PLOT_H - 5} ${PAD.left + PLOT_W + 10},${PAD.top + PLOT_H} ${PAD.left + PLOT_W},${PAD.top + PLOT_H + 5}`}
          fill="rgba(255,255,255,0.15)"
        />
        <text
          x={PAD.left + PLOT_W + 14}
          y={PAD.top + PLOT_H + 4}
          fontSize={9}
          fill="rgba(255,255,255,0.25)"
          fontFamily="system-ui,sans-serif"
        >
          Maturity →
        </text>

        {/* ── S-Curve (shadow + line) ── */}
        <path d={CURVE_PATH} fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth={10} />
        <path
          d={CURVE_PATH}
          fill="none"
          stroke="#f97316"
          strokeWidth={2.5}
          filter="url(#curve-glow)"
        />

        {/* ── Signal labels (rendered before dots so dots sit on top) ── */}
        {filters.showLabels &&
          visible.map((signal) => {
            const layout = labelLayouts.get(signal.id);
            if (!layout) return null;
            const color = DISRUPTION_COLORS[signal.disruption_level];
            const isSelected = selectedSignal?.id === signal.id;
            return (
              <text
                key={`lbl-${signal.id}`}
                x={layout.x}
                y={layout.y}
                textAnchor={layout.anchor}
                fontSize={10}
                fill={isSelected ? color : 'rgba(255,255,255,0.65)'}
                fontWeight={isSelected ? 700 : 400}
                fontFamily="system-ui,sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {signal.title}
              </text>
            );
          })}

        {/* ── Signal dots ── */}
        {visible.map((signal) => {
          const { x, y } = signalToSVG(signal);
          const color = DISRUPTION_COLORS[signal.disruption_level];
          const isSelected = selectedSignal?.id === signal.id;
          return (
            <g
              key={signal.id}
              onClick={() => onSignalClick(signal)}
              onMouseEnter={(e) => handleMouseEnter(e, signal)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer glow ring */}
              <circle
                cx={x} cy={y}
                r={isSelected ? 16 : 12}
                fill={color}
                opacity={isSelected ? 0.25 : 0.12}
                filter={isSelected ? 'url(#dot-glow-sel)' : undefined}
              />
              {/* Inner dot */}
              <circle
                cx={x} cy={y}
                r={isSelected ? 8 : 6}
                fill={color}
                filter="url(#dot-glow)"
                opacity={0.9}
              />
              {/* Dot border */}
              <circle
                cx={x} cy={y}
                r={isSelected ? 8 : 6}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                opacity={0.6}
              />
            </g>
          );
        })}

        {/* ── Tooltip ── */}
        {tooltip && (() => {
          const tx = tooltip.svgX;
          const ty = tooltip.svgY;
          const tipW = 200;
          const tipH = 68;
          // Position above-right, flip left if near right edge
          const flipLeft = tx + tipW + 16 > VB_W - PAD.right;
          const rx = flipLeft ? tx - tipW - 12 : tx + 12;
          const ry = Math.max(PAD.top, ty - tipH - 8);
          const color = DISRUPTION_COLORS[tooltip.signal.disruption_level];
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={rx} y={ry} width={tipW} height={tipH}
                rx={6} ry={6}
                fill="#12122a"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
              />
              <rect x={rx} y={ry} width={4} height={tipH} rx={3} fill={color} />
              <text x={rx + 12} y={ry + 18} fontSize={11} fontWeight={700}
                fill="rgba(255,255,255,0.92)" fontFamily="system-ui,sans-serif">
                {tooltip.signal.title.length > 26
                  ? tooltip.signal.title.slice(0, 25) + '…'
                  : tooltip.signal.title}
              </text>
              <text x={rx + 12} y={ry + 35} fontSize={9.5}
                fill="rgba(255,255,255,0.5)" fontFamily="system-ui,sans-serif">
                {tooltip.signal.maturity_stage.charAt(0).toUpperCase() + tooltip.signal.maturity_stage.slice(1)}
                {' · '}
                {tooltip.signal.zone.charAt(0).toUpperCase() + tooltip.signal.zone.slice(1)} Zone
              </text>
              <text x={rx + 12} y={ry + 52} fontSize={9.5}
                fill={color} fontFamily="system-ui,sans-serif" fontWeight={600}>
                {tooltip.signal.disruption_level.charAt(0).toUpperCase() + tooltip.signal.disruption_level.slice(1)} disruption
              </text>
              <text x={rx + 12} y={ry + 63} fontSize={8.5}
                fill="rgba(255,255,255,0.3)" fontFamily="system-ui,sans-serif">
                Click to open full card
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
