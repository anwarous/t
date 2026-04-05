/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['IBM Plex Mono', 'monospace'],
        mono:    ['IBM Plex Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Primary accent — electric cyan, committed everywhere
        brand: {
          50:  '#e0fef8',
          100: '#b3fced',
          200: '#80f9e0',
          300: '#4df6d3',
          400: '#26f4cc',
          500: '#00f5d4',
          600: '#00c4aa',
          700: '#009380',
          800: '#006b5e',
          900: '#004d44',
        },
        // Deep charcoal surfaces
        surface: {
          50:  '#f0f4f4',
          100: '#dde4e8',
          200: '#b8c6ce',
          300: '#8ea4ae',
          400: '#6b7d8e',
          500: '#4a5768',
          600: '#30404e',
          700: '#1e2d38',
          800: '#131e28',
          900: '#0e1520',
          950: '#0d0f14',
        },
        // Accent helpers
        accent: {
          cyan:   '#00f5d4',
          green:  '#a3e635',
          amber:  '#f0a030',
          rose:   '#f43f5e',
          purple: '#7c3aed',
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='1'/%3E%3C/svg%3E\")",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'shimmer':    'shimmer 2s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bar-grow':   'barGrow 0.5s ease-out forwards',
        'stagger-in': 'staggerIn 0.3s ease-out both',
        'progress':   'progressFill 1s ease-out forwards',
        'ring-spin':  'ringSpin 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition:  '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        barGrow: {
          '0%':   { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        staggerIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressFill: {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        ringSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(0,245,212,0.4)',
        'glow-blue':   '0 0 20px rgba(0,245,212,0.35)',
        'glow-cyan':   '0 0 20px rgba(0,245,212,0.4)',
        'glow-amber':  '0 0 16px rgba(240,160,48,0.4)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.35)',
        'card':        '0 4px 20px rgba(0,0,0,0.3)',
        'card-hover':  '0 8px 40px rgba(0,0,0,0.45)',
        'inner-top':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight':   '-0.02em',
      },
    },
  },
  plugins: [],
}
