/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heraldic: ['Pirata One', 'Heraldic Shadows', 'serif'],
        pirata: ['Pirata One', 'serif'],
      },
    },
  },
  plugins: [],
};
