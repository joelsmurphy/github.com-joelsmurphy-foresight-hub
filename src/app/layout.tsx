import type { Metadata } from 'next';
import { Montserrat, Spectral } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-spectral',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Foresight Hub — Signal Intelligence for Ministry',
  description:
    'Interactive S-curve signal mapping and strategic ministry innovation assistant for foresight-informed leadership.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${spectral.variable}`}>
      <body style={{ fontFamily: 'var(--font-montserrat), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
