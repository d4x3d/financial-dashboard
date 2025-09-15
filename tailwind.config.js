/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wf-primary': '#1a5336', // Primary green color
        'wf-secondary': '#038203', // Secondary green color
        'wf-gray': '#F5F5F5',
        'wf-dark': '#333333',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
