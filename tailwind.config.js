/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Unbounded Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#02050a',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translate3d(var(--dx, 20px), -120px, 0)', opacity: '0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(var(--bx, 6%), var(--by, -5%), 0) scale(1.15)' },
        },
        scrollHint: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' },
        },
      },
      animation: {
        drift: 'drift 9s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 120s linear infinite',
        blob: 'blob 14s ease-in-out infinite',
        'scroll-hint': 'scrollHint 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
