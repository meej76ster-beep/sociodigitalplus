/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#050811',
          900: '#070B14',
          850: '#0B1222',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
        amberGlow: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        oliveSerenity: {
          400: '#A3E635',
          500: '#84CC16',
          600: '#65A30D',
          700: '#4D7C0F',
          900: '#1A2E05',
        },
        caramel: {
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
      animation: {
        'candle-flicker': 'candleFlicker 3s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'ripple': 'ripple 4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        candleFlicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))' },
          '25%': { transform: 'scale(1.05) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.8))' },
          '50%': { transform: 'scale(0.97) rotate(-0.5deg)', opacity: '0.88', filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.5))' },
          '75%': { transform: 'scale(1.03) rotate(0.5deg)', opacity: '0.98', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.75))' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      },
      boxShadow: {
        'candle': '0 0 35px -5px rgba(245, 158, 11, 0.35)',
        'candle-lg': '0 0 60px -10px rgba(245, 158, 11, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
