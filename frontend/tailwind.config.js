/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50: '#f0f9fb',
          100: '#d4eef4',
          200: '#a9dde9',
          300: '#7ecbde',
          400: '#33a8c4',
          500: '#006989',
          600: '#053F61',
          700: '#042f4a',
          800: '#032033',
          900: '#01111c',
        },
        accent: {
          DEFAULT: '#FF5714',
          hover: '#CC4610',
        },
        surface: '#EAEBED',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)',
        modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'modal-in': 'modal-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
