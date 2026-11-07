import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        navy: {
          50:  '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d4fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#1e2a52',
          900: '#0e1628',
          950: '#090e1c',
        },
        ivory: {
          50:  '#fdfcf9',
          100: '#faf8f2',
          200: '#f5f0e5',
          300: '#ede5d0',
          400: '#e2d5b8',
          500: '#d4c49e',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        gold: {
          100: '#fef9ec',
          200: '#fde68a',
          300: '#f9c846',
          400: '#f4a90a',
          500: '#d48e05',
          600: '#a86e03',
        },
        brand: {
          50:  '#f0f0ff',
          100: '#e4e4ff',
          200: '#ccccff',
          300: '#a8a8ff',
          400: '#7c7cff',
          500: '#5a4fff',
          600: '#4a3ef0',
          700: '#3d30d6',
          800: '#3228ae',
          900: '#2b2489',
          950: '#1a1654',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        surface: {
          50:  '#f8f9ff',
          100: '#f1f2fe',
          800: '#0f0f1a',
          900: '#09090f',
          950: '#05050b',
        },
      },
      backgroundImage: {
        'gradient-hero':  'linear-gradient(145deg, #090e1c 0%, #0e1628 50%, #16203d 80%, #090e1c 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(20,184,166,0.05) 100%)',
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
        'gradient-gold':  'linear-gradient(135deg, #f9c846 0%, #f4a90a 100%)',
      },
      animation: {
        'fade-in':       'fadeIn 0.7s ease-out forwards',
        'slide-up':      'slideUp 0.7s ease-out forwards',
        'slide-in-right':'slideInRight 0.5s ease-out forwards',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'navy':      '0 4px 32px rgba(9,14,28,0.5)',
        'navy-lg':   '0 16px 64px rgba(9,14,28,0.6)',
        'ivory':     '0 4px 24px rgba(212,196,158,0.12)',
        'ivory-lg':  '0 16px 48px rgba(212,196,158,0.22)',
        'gold':      '0 4px 20px rgba(244,169,10,0.3)',
        'teal':      '0 4px 20px rgba(20,184,166,0.3)',
        'card':      '0 2px 16px rgba(14,22,40,0.10), 0 1px 4px rgba(14,22,40,0.06)',
        'card-dark': '0 8px 32px rgba(9,14,28,0.4)',
        'glow-brand':'0 0 30px rgba(99,102,241,0.4)',
        'glow-accent':'0 0 30px rgba(20,184,166,0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
