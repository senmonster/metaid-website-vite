/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        phone: '516px',
      },
      colors: {
        main: '#E9983D',
      },
    },
  },
  plugins: [],
};
