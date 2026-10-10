/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Bolalar uchun yorqin, pastel palitra
        soft: {
          yellow: '#FFF3B0',
          sky: '#A8DADC',
          mint: '#B7E4C7',
          purple: '#CDB4DB',
          pink: '#FFC8DD',
          orange: '#FFD6A5',
        },
        candy: {
          purple: '#7B2CBF',
          blue: '#4361EE',
          green: '#2DC653',
          pink: '#F72585',
          orange: '#FF8500',
        },
        kid: {
          bg: '#F8F7FF',
          card: 'rgba(255, 255, 255, 0.72)',
        },
      },
      fontFamily: {
        fun: ['"Baloo 2"', '"Comic Sans MS"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 32px rgba(123, 44, 191, 0.12)',
        candy: '0 6px 0 rgba(0,0,0,0.08)',
        pop: '0 10px 40px rgba(67, 97, 238, 0.18)',
        glow: '0 0 20px rgba(123, 44, 191, 0.35)',
        'glow-green': '0 0 20px rgba(45, 198, 83, 0.4)',
      },
      borderRadius: {
        blob: '2rem',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(168,218,220,0.5), rgba(205,180,219,0.5), rgba(255,243,176,0.5))',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pop-in-long': 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wiggle': 'wiggle 0.6s ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'float-soft': 'floatSoft 8s ease-in-out infinite',
        'tada': 'tada 1s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 6s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out both',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(12px, -18px) rotate(8deg)' },
          '66%': { transform: 'translate(-10px, 8px) rotate(-6deg)' },
        },
        tada: {
          '0%': { transform: 'scale(1)' },
          '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
          '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(123, 44, 191, 0.35)' },
          '50%': { boxShadow: '0 0 28px rgba(123, 44, 191, 0.7)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};