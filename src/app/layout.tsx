import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Foresight Hub — Signal Intelligence for Ministry',
  description:
    'Interactive S-curve signal mapping and strategic ministry innovation assistant for foresight-informed leadership.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
