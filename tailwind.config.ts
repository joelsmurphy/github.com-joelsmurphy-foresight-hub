import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: '#080810',
          surface: '#0f0f1a',
          border: '#1e1e35',
          hover: '#161628',
        },
        amber: {
          glow: '#f97316',
        },
      },
    },
  },
  plugins: [],
};

export default config;
