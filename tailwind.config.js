/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './templates/**/*.{json,liquid}',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './assets/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-primary--family)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
