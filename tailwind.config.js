/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#19271F',
          light: '#26372C',
        },
        charcoal: '#171B18',
        gold: {
          DEFAULT: '#C4A46A',
          light: '#D8BF8F',
          dark: '#A5854C',
        },
        ivory: '#F8F7F2',
        muted: '#8C8D86',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px -20px rgba(25, 39, 31, 0.28)',
        gold: '0 0 0 1px rgba(196, 164, 106, 0.45), 0 14px 36px -10px rgba(196, 164, 106, 0.55)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        floaty: 'floaty 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
