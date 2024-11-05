/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{hbs,html}', // Add your views directory
    './public/**/*.html',       // If you have static HTML files
    './resources/**/*.css'         // If you use Tailwind CSS classes in your CSS files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),        // Ensure DaisyUI is included
  ],
  daisyui: {
    themes: ["emerald", "dim"],
  },
};