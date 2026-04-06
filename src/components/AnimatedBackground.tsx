'use client';

import { useEffect, useRef } from 'react';

// ADC color palette
const ADC_BLUE      = '#004077';
const ADC_RED       = '#C41424';
const BLUE_SKIES    = '#62B5E5';
const TIDEPOOL      = '#48A9C5';
const FUNDY         = '#407EC9';

type ShapeKind = 'triangle' | 'rect' | 'circle' | 'diamond';

interface GeoShape {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number; rotSpeed: number;
  size: number;
  kind: ShapeKind;
  color: string;
  alpha: number; alphaDir: number; alphaSpeed: number;
}

interface Node {
  x: number; y: number;
  vx: number; vy: number;
}

const COLORS = [ADC_BLUE, ADC_BLUE, BLUE_SKIES, BLUE_SKIES, TIDEPOOL, FUNDY, ADC_RED];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function colorWithAlpha(hex: string, alpha: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawTriangle(ctx: CanvasRenderingContext2D, size: number) {
  const h = size * 0.866;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.667);
  ctx.lineTo(size * 0.5, h * 0.333);
  ctx.lineTo(-size * 0.5, h * 0.333);
  ctx.closePath();
}

function drawRect(ctx: CanvasRenderingContext2D, size: number) {
  const w = size * 1.2;
  const h = size * 0.7;
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2, w, h);
}

function drawCircle(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
}

function drawDiamond(ctx: CanvasRenderingContext2D, size: number) {
  const s = size * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.6, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.6, 0);
  ctx.closePath();
}

function drawShape(ctx: CanvasRenderingContext2D, shape: GeoShape) {
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.rotation);

  const [r, g, b] = hexToRgb(shape.color);
  const a = shape.alpha;

  // No shadowBlur — too expensive
  ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
  ctx.lineWidth = 1;
  ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.05})`;

  if (shape.kind === 'triangle') drawTriangle(ctx, shape.size);
  else if (shape.kind === 'rect') drawRect(ctx, shape.size);
  else if (shape.kind === 'circle') drawCircle(ctx, shape.size);
  else drawDiamond(ctx, shape.size);

  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let shapes: GeoShape[] = [];
    let nodes: Node[] = [];
    let lastTime = 0;
    const INTERVAL = 1000 / 30; // 30fps cap

    const KINDS: ShapeKind[] = ['triangle', 'triangle', 'rect', 'circle', 'diamond'];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function spawn() {
      if (!canvas) return;
      const area = canvas.width * canvas.height;

      // Fewer shapes — capped at 5
      const shapeCount = Math.min(5, Math.max(3, Math.floor(area / 80000)));
      shapes = Array.from({ length: shapeCount }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-0.08, 0.08),
        vy: rand(-0.1, 0.03),
        rotation: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.002, 0.002),
        size: rand(30, 75),
        kind: KINDS[Math.floor(Math.random() * KINDS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: rand(0.08, 0.28),
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: rand(0.0005, 0.002),
      }));

      // Fewer nodes — capped at 8
      const nodeCount = Math.min(8, Math.max(4, Math.floor(area / 60000)));
      nodes = Array.from({ length: nodeCount }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-0.06, 0.06),
        vy: rand(-0.06, 0.06),
      }));
    }

    function tick(now: number) {
      if (!canvas || !ctx) return;

      // Pause when tab is hidden
      if (document.hidden) { animId = requestAnimationFrame(tick); return; }

      // Throttle to 30fps
      if (now - lastTime < INTERVAL) { animId = requestAnimationFrame(tick); return; }
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;
        s.alpha += s.alphaSpeed * s.alphaDir;
        if (s.alpha > 0.28 || s.alpha < 0.04) s.alphaDir *= -1;
        if (s.y < -100) s.y = canvas.height + 100;
        if (s.y > canvas.height + 100) s.y = -100;
        if (s.x < -100) s.x = canvas.width + 100;
        if (s.x > canvas.width + 100) s.x = -100;
        drawShape(ctx, s);
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Connection lines — no shadowBlur
      const CONNECT_DIST = 120;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = colorWithAlpha(BLUE_SKIES, (1 - dist / CONNECT_DIST) * 0.15);
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha(BLUE_SKIES, 0.4);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => { resize(); spawn(); });
    ro.observe(canvas);
    resize(); spawn();
    animId = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>

      {/* Deep navy base */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(150deg, #041C2C 0%, #062034 50%, #041C2C 100%)' }}
      />

      {/* ADC Blue ambient glow — top left */}
      <div
        className="geo-shape-1 absolute rounded-full"
        style={{
          width: '55%', height: '75%',
          top: '-25%', left: '-10%',
          background: 'radial-gradient(ellipse, rgba(0,64,119,0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ADC Red ambient glow — top right */}
      <div
        className="geo-shape-2 absolute rounded-full"
        style={{
          width: '45%', height: '60%',
          top: '-10%', right: '-10%',
          background: 'radial-gradient(ellipse, rgba(196,20,36,0.14) 0%, transparent 65%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Blue Skies ambient — bottom center */}
      <div
        className="geo-shape-3 absolute rounded-full"
        style={{
          width: '50%', height: '50%',
          bottom: '-15%', left: '22%',
          background: 'radial-gradient(ellipse, rgba(98,181,229,0.08) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Particle + geometry canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(98,181,229,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(98,181,229,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 40%, transparent 100%)',
        }}
      />

      {/* Bottom fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '45%', background: 'linear-gradient(to bottom, transparent, #041C2C)' }}
      />

      {/* ADC branded shimmer rule at base */}
      <div
        className="border-shimmer absolute bottom-0 left-0 right-0"
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(98,181,229,0.7), rgba(196,20,36,0.5), transparent)',
        }}
      />
    </div>
  );
}
