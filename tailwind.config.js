/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wf-red': '#AB0600FF', // Cobalt Blue for navbar
        'wf-red-dark': '#003380', // Darker blue
        'wf-yellow': '#C7821AFF', // Red accent line
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
