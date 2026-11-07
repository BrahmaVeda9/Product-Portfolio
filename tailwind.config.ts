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
        // ── Brand Palette ──────────────────────────────────
        burgundy: {
          50:  '#fdf2f2',
          100: '#fce4e3',
          200: '#fac9c8',
          300: '#f49e9c',
          400: '#eb6a67',
          500: '#d93f3c',
          600: '#c02020',
          700: '#931112',
          800: '#590907', // Deep Burgundy — primary accent
          900: '#3d0505',
          950: '#220202',
        },
        sage: {
          50:  '#f5f5f3',
          100: '#eaeae6',
          200: '#d4d5cd',
          300: '#b8bab0',
          400: '#A5A79B', // Muted Sage Grey — alternate BG
          500: '#8f9183',
          600: '#767869',
          700: '#5f6155',
          800: '#4e5046',
          900: '#40423a',
          950: '#252720',
        },
        cream: {
          50:  '#fdfaf5',
          100: '#faf4e8',
          200: '#E8D2B5', // Warm Cream Beige — light BG
          300: '#d9b98a',
          400: '#c99f5e',
          500: '#b8873d',
          600: '#9a6e2f',
          700: '#7c5525',
          800: '#66441e',
          900: '#553819',
          950: '#2e1d0a',
        },
        charcoal: '#292724',
        // Legacy palette kept for admin
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
        brand: {
          50:  '#fdf2f2',
          100: '#fce4e3',
          200: '#E8D2B5',
          300: '#d9b98a',
          400: '#E8D2B5',
          500: '#590907',
          600: '#7a0c0a',
          700: '#590907',
          800: '#3d0505',
          900: '#220202',
          950: '#140101',
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
        'gradient-hero':     'linear-gradient(145deg, #590907 0%, #3d0505 50%, #220202 80%, #590907 100%)',
        'gradient-hero-alt': 'linear-gradient(145deg, #590907 0%, #7a0c0a 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(89,9,7,0.06) 0%, rgba(165,167,155,0.04) 100%)',
        'gradient-brand':    'linear-gradient(135deg, #590907 0%, #931112 100%)',
        'gradient-burgundy': 'linear-gradient(135deg, #590907 0%, #931112 100%)',
        'gradient-sage':     'linear-gradient(135deg, #A5A79B 0%, #8f9183 100%)',
      },
      animation: {
        'fade-in':        'fadeIn 0.7s ease-out forwards',
        'slide-up':       'slideUp 0.7s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':          'float 6s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
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
        'burgundy':     '0 4px 24px rgba(89,9,7,0.35)',
        'burgundy-lg':  '0 12px 48px rgba(89,9,7,0.45)',
        'sage':         '0 4px 20px rgba(165,167,155,0.25)',
        'sage-lg':      '0 12px 40px rgba(165,167,155,0.35)',
        'cream':        '0 4px 20px rgba(232,210,181,0.3)',
        'cream-lg':     '0 12px 40px rgba(232,210,181,0.4)',
        'card':         '0 2px 16px rgba(41,39,36,0.08), 0 1px 4px rgba(41,39,36,0.05)',
        'card-hover':   '0 8px 32px rgba(41,39,36,0.14), 0 2px 8px rgba(41,39,36,0.08)',
        'card-dark':    '0 8px 32px rgba(89,9,7,0.3)',
        'glow-brand':   '0 0 30px rgba(89,9,7,0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
