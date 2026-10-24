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
        // Brand palette — deep indigo + electric violet + warm slate
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
        'gradient-hero': 'linear-gradient(135deg, #09090f 0%, #1a1654 50%, #09090f 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(90,79,255,0.08) 0%, rgba(6,182,212,0.05) 100%)',
        'gradient-brand': 'linear-gradient(135deg, #5a4fff 0%, #06b6d4 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(90,79,255,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(90,79,255,0.6), 0 0 80px rgba(6,182,212,0.2)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-brand': '0 0 30px rgba(90,79,255,0.4)',
        'glow-accent': '0 0 30px rgba(6,182,212,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(90,79,255,0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
