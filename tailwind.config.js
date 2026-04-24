/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          primary: '#1e40af',
          secondary: '#3b82f6',
          score: '#1d4ed8',
          live: '#dc2626',
          success: '#16a34a',
          warning: '#ea580c',
          'dark-bg': '#0f172a',
        },
        gray: {
          100: '#f8fafc',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        cricket: ['"Segoe UI"', 'Tahoma', 'system-ui', 'sans-serif'],
        score: ['"Barlow Condensed"', '"Barlow"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-fast': 'bounce 0.5s infinite',
        live: 'livePulse 1s ease-in-out infinite',
      },
      keyframes: {
        livePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
};