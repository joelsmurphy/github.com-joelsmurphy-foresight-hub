'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'up' | 'left' | 'right' | 'scale';
  delay?: 0 | 1 | 2 | 3 | 4;
  threshold?: number;
}

const VARIANT_CLASS: Record<NonNullable<Props['variant']>, string> = {
  up:    'reveal',
  left:  'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
};

export default function Reveal({
  children,
  className = '',
  style,
  variant = 'up',
  delay = 0,
  threshold,
}: Props) {
  const ref = useScrollReveal({ threshold });
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`${VARIANT_CLASS[variant]} ${delayClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
