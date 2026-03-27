/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef3ff',
          100: '#dce8ff',
          200: '#b2ccff',
          300: '#6d9fff',
          400: '#3b7bff',
          500: '#1a5cff',
          600: '#0039f5',
          700: '#002bcc',
          800: '#0024a6',
          900: '#001a82',
        },
        surface: {
          50:  '#f8f9fc',
          100: '#f0f2f8',
          200: '#e2e6f0',
          300: '#c8cfde',
          400: '#8b95b0',
          500: '#5e6880',
          600: '#3d4560',
          700: '#252d48',
          800: '#141c35',
          900: '#090e1f',
          950: '#050810',
        },
        accent: {
          cyan:   '#00d4ff',
          purple: '#7c3aed',
          green:  '#10b981',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E\")",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bar-grow': 'barGrow 0.5s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        barGrow: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow-blue':   '0 0 20px rgba(26, 92, 255, 0.4)',
        'glow-cyan':   '0 0 20px rgba(0, 212, 255, 0.4)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover':  '0 8px 40px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
