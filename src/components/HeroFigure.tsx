'use client';

// Abstract futuristic human figure with geometric network overlay
// Matches ADC brand palette and Futuring Hub geometric aesthetic
export default function HeroFigure() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 420 }}>

      {/* Outer glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 340, height: 340,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(0,64,119,0.18) 0%, rgba(196,20,36,0.06) 50%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <svg
        viewBox="0 0 440 520"
        width="100%"
        height="100%"
        style={{ maxWidth: 440, maxHeight: 520 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="figGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#62B5E5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C41424" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#62B5E5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#004077" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="triGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#004077" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#62B5E5" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#62B5E5" stopOpacity="1" />
            <stop offset="100%" stopColor="#62B5E5" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Background geometric shapes ──────────────────────── */}

        {/* Large triangle — back left */}
        <polygon
          points="30,420 130,220 230,420"
          stroke="#004077" strokeWidth="1.2" strokeOpacity="0.35"
          fill="#004077" fillOpacity="0.04"
        />

        {/* Large triangle — back right */}
        <polygon
          points="220,380 340,160 420,380"
          stroke="#62B5E5" strokeWidth="1" strokeOpacity="0.2"
          fill="#62B5E5" fillOpacity="0.03"
        />

        {/* Floating rectangle — top right */}
        <rect
          x="320" y="40" width="90" height="55" rx="2"
          stroke="#C41424" strokeWidth="1" strokeOpacity="0.3"
          fill="#C41424" fillOpacity="0.04"
          transform="rotate(-12, 365, 67)"
        />

        {/* Small diamond — bottom left */}
        <polygon
          points="55,460 80,430 105,460 80,490"
          stroke="#48A9C5" strokeWidth="1" strokeOpacity="0.4"
          fill="#48A9C5" fillOpacity="0.05"
        />

        {/* ── Human figure ─────────────────────────────────────── */}

        {/* Head — circle outline */}
        <circle
          cx="220" cy="140" r="68"
          stroke="url(#figGrad)" strokeWidth="1.5" strokeOpacity="0.55"
          fill="rgba(0,64,119,0.08)"
        />

        {/* Inner head detail — smaller circle */}
        <circle
          cx="220" cy="140" r="48"
          stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.2"
          fill="none"
        />

        {/* Neck */}
        <line x1="220" y1="208" x2="220" y2="248" stroke="#62B5E5" strokeWidth="1.2" strokeOpacity="0.4" />

        {/* Shoulders */}
        <path
          d="M100 300 Q150 250 220 248 Q290 250 340 300"
          stroke="url(#bodyGrad)" strokeWidth="1.5"
          fill="none"
        />

        {/* Torso outline */}
        <path
          d="M140 300 L120 460 L320 460 L300 300"
          stroke="#004077" strokeWidth="1" strokeOpacity="0.3"
          fill="rgba(0,64,119,0.04)"
        />

        {/* Chest geometric cross-hatch */}
        <line x1="160" y1="320" x2="280" y2="320" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.15" />
        <line x1="155" y1="360" x2="285" y2="360" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.15" />
        <line x1="150" y1="400" x2="290" y2="400" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.15" />
        <line x1="220" y1="300" x2="220" y2="460" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.12" />

        {/* ── Overlay geometric network ─────────────────────────── */}

        {/* Network connection lines */}
        <line x1="220" y1="140" x2="360" y2="80"  stroke="#62B5E5" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 4" />
        <line x1="220" y1="140" x2="70"  y2="110" stroke="#62B5E5" strokeWidth="0.8" strokeOpacity="0.2"  strokeDasharray="4 4" />
        <line x1="220" y1="140" x2="380" y2="200" stroke="#C41424" strokeWidth="0.8" strokeOpacity="0.2"  strokeDasharray="3 5" />
        <line x1="220" y1="140" x2="55"  y2="220" stroke="#004077" strokeWidth="0.8" strokeOpacity="0.3"  strokeDasharray="4 4" />
        <line x1="360" y1="80"  x2="380" y2="200" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.15" />
        <line x1="70"  y1="110" x2="55"  y2="220" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.15" />
        <line x1="380" y1="200" x2="340" y2="300" stroke="#48A9C5" strokeWidth="0.6" strokeOpacity="0.2" />
        <line x1="55"  y1="220" x2="100" y2="300" stroke="#48A9C5" strokeWidth="0.6" strokeOpacity="0.2" />

        {/* ── Network nodes ─────────────────────────────────────── */}

        {/* Center node — on figure head */}
        <circle cx="220" cy="140" r="5" fill="#62B5E5" fillOpacity="0.9" filter="url(#glow)" />
        <circle cx="220" cy="140" r="10" fill="#62B5E5" fillOpacity="0.15" />

        {/* Outer nodes */}
        <circle cx="360" cy="80"  r="4" fill="#62B5E5" fillOpacity="0.7" filter="url(#glow)" />
        <circle cx="360" cy="80"  r="8" fill="#62B5E5" fillOpacity="0.1" />

        <circle cx="70"  cy="110" r="3.5" fill="#48A9C5" fillOpacity="0.7" filter="url(#glow)" />
        <circle cx="70"  cy="110" r="7" fill="#48A9C5" fillOpacity="0.1" />

        <circle cx="380" cy="200" r="4" fill="#C41424" fillOpacity="0.8" filter="url(#glow)" />
        <circle cx="380" cy="200" r="8" fill="#C41424" fillOpacity="0.12" />

        <circle cx="55"  cy="220" r="3" fill="#62B5E5" fillOpacity="0.6" />
        <circle cx="340" cy="300" r="3" fill="#48A9C5" fillOpacity="0.6" />
        <circle cx="100" cy="300" r="3" fill="#62B5E5" fillOpacity="0.5" />

        {/* Small satellite nodes */}
        <circle cx="290" cy="55"  r="2.5" fill="#62B5E5" fillOpacity="0.5" />
        <circle cx="155" cy="50"  r="2"   fill="#C41424" fillOpacity="0.5" />
        <circle cx="410" cy="140" r="2.5" fill="#62B5E5" fillOpacity="0.4" />
        <circle cx="25"  cy="160" r="2"   fill="#48A9C5" fillOpacity="0.45" />

        <line x1="360" y1="80"  x2="290" y2="55"  stroke="#62B5E5" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="70"  y1="110" x2="155" y2="50"  stroke="#62B5E5" strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="380" y1="200" x2="410" y2="140" stroke="#C41424" strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="55"  y1="220" x2="25"  y2="160" stroke="#62B5E5" strokeWidth="0.5" strokeOpacity="0.15" />

        {/* ── Floating stacked triangles (Futuring Hub motif) ─── */}

        {/* Stack 1 — upper left, three overlapping triangles */}
        <polygon points="60,180 90,130 120,180" stroke="#004077" strokeWidth="1.2" strokeOpacity="0.5" fill="#004077" fillOpacity="0.06" />
        <polygon points="68,180 90,138 112,180" stroke="#62B5E5" strokeWidth="0.8" strokeOpacity="0.35" fill="none" />
        <polygon points="76,180 90,146 104,180" stroke="#62B5E5" strokeWidth="0.6" strokeOpacity="0.2"  fill="none" />

        {/* Stack 2 — upper right, three overlapping triangles in red */}
        <polygon points="315,110 345,60 375,110" stroke="#C41424" strokeWidth="1.2" strokeOpacity="0.45" fill="#C41424" fillOpacity="0.05" />
        <polygon points="323,110 345,68 367,110" stroke="#C41424" strokeWidth="0.8" strokeOpacity="0.3"  fill="none" />
        <polygon points="331,110 345,76 359,110" stroke="#C41424" strokeWidth="0.6" strokeOpacity="0.2"  fill="none" />

        {/* Data arc — partial circle around figure */}
        <path
          d="M 152 72 A 80 80 0 0 1 288 72"
          stroke="url(#figGrad)" strokeWidth="1" strokeOpacity="0.3"
          fill="none" strokeDasharray="6 4"
        />

        {/* Scanning line across face */}
        <line x1="155" y1="130" x2="285" y2="130" stroke="#62B5E5" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />

        {/* Eye markers */}
        <circle cx="196" cy="128" r="3.5" stroke="#62B5E5" strokeWidth="1" strokeOpacity="0.6" fill="#62B5E5" fillOpacity="0.15" />
        <circle cx="244" cy="128" r="3.5" stroke="#62B5E5" strokeWidth="1" strokeOpacity="0.6" fill="#62B5E5" fillOpacity="0.15" />
        <circle cx="196" cy="128" r="1.2" fill="#62B5E5" fillOpacity="0.8" />
        <circle cx="244" cy="128" r="1.2" fill="#62B5E5" fillOpacity="0.8" />

      </svg>
    </div>
  );
}
