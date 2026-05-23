/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        navy: {
          950: '#060B14',
          900: '#0A1628',
          800: '#0D1520',
          700: '#1A2840',
          600: '#243656',
        },
        electric: {
          DEFAULT: '#0066FF',
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        cyan: {
          DEFAULT: '#00D4FF',
          50: '#E6FAFF',
          100: '#CCF5FF',
          200: '#99EBFF',
          300: '#66E0FF',
          400: '#33D6FF',
          500: '#00D4FF',
          600: '#00AACC',
          700: '#007F99',
          800: '#005566',
          900: '#002A33',
        },
        orange: {
          DEFAULT: '#FF6B35',
          50: '#FFF0EB',
          100: '#FFE1D6',
          200: '#FFC3AD',
          300: '#FFA585',
          400: '#FF885C',
          500: '#FF6B35',
          600: '#CC5529',
          700: '#99401E',
          800: '#662B14',
          900: '#33150A',
        },
        success: '#00FF88',
        warning: '#FFB800',
        error: '#FF3B3B',
        light: {
          bg: '#F0F4FF',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          text: '#060B14',
          muted: '#475569',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        flicker: 'flicker 3s ease-in-out infinite',
        'data-flow': 'data-flow 2s linear infinite',
        'boot-up': 'boot-up 0.6s cubic-bezier(0.25,0.1,0.25,1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'status-pulse': 'status-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.94' },
          '50%': { opacity: '0.82' },
          '66%': { opacity: '0.96' },
        },
        'data-flow': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 200%' },
        },
        'boot-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'status-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 currentColor' },
          '50%': { boxShadow: '0 0 0 4px transparent' },
        },
      },
      backgroundImage: {
        'circuit-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v20M30 40v20M0 30h20M40 30h20' stroke='%231A2840' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%231A2840'/%3E%3C/svg%3E\")",
        'grid-pattern':
          'linear-gradient(rgba(0,102,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        circuit: '60px 60px',
        grid: '40px 40px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,102,255,0.15)',
        'glow-cyan': '0 0 20px rgba(0,212,255,0.15)',
        'glow-orange': '0 0 20px rgba(255,107,53,0.15)',
        'glow-success': '0 0 20px rgba(0,255,136,0.15)',
        card: '0 4px 24px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
