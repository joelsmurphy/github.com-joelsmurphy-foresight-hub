'use client';

import { useState } from 'react';

export default function HowToRead() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-2.5">
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <circle cx={7} cy={7} r={6} stroke="rgba(249,115,22,0.7)" strokeWidth={1.3} />
            <path d="M7 6v4M7 4v0.5" stroke="rgba(249,115,22,0.7)" strokeWidth={1.4} strokeLinecap="round" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            How to Read This Chart
          </span>
        </div>
        <svg
          width={12} height={12} viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'rgba(255,255,255,0.3)' }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="px-5 pb-5 grid grid-cols-2 gap-x-8 gap-y-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="col-span-2 pt-3">
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              The S-curve maps signals of change according to their maturity and level of impact or adoption.
            </p>
          </div>

          {[
            { icon: '←', label: 'Left side', desc: 'Fringe / emerging — few aware, limited adoption' },
            { icon: '→', label: 'Right side', desc: 'Established / structural — mainstream and embedded' },
            { icon: '↑', label: 'Higher on chart', desc: 'Greater impact, adoption, or influence' },
            { icon: '〜', label: 'Steeper middle', desc: 'Rapid growth phase — fastest rate of change' },
            { icon: '●', label: 'Green dot', desc: 'Incremental disruption — builds on existing systems' },
            { icon: '●', label: 'Amber dot', desc: 'Substantive disruption — meaningful structural change' },
            { icon: '●', label: 'Red dot', desc: 'Transformative disruption — challenges core assumptions' },
          ].map((item) => (
            <div key={item.label} className="flex gap-2.5 items-start pt-2">
              <span className="text-base leading-none flex-shrink-0" style={{ color: 'rgba(249,115,22,0.6)', width: 18 }}>
                {item.icon}
              </span>
              <div>
                <span className="text-xs font-semibold block" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {item.label}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
