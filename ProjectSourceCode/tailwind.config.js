/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,hbs}', // Adjust to match your structure
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
