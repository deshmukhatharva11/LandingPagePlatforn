/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#0d0f14',
        secondary: {
          DEFAULT: '#C8922A',
          50: '#F9EDD6',
          100: '#F5E0B8',
          200: '#EEC77C',
          300: '#E8AE41',
          400: '#D49828',
          500: '#C8922A',
          600: '#A07220',
          700: '#785417',
          800: '#50380F',
          900: '#281B07',
        },
        accent: {
          light: '#d4b896',
          DEFAULT: '#c4a882',
          dark: '#b09070',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Raleway', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slowZoom': 'slowZoom 20s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
        slowZoom: {
          '0%, 100%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(to right, #C8922A, #A07220)',
      },
    },
  },
  plugins: [],
};