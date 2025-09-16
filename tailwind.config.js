/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "wf-primary": "#1a5336", // Primary deep green
        "wf-secondary": "#038203", // Secondary green
        "wf-gray": "#F5F5F5",
        "wf-dark": "#333333",
        // Rebrand all "red" tokens to greens so the entire app theme is green/deep green
        "wf-red": "#1a5336", // Deep green (was brand red)
        "wf-red-dark": "#0f3a26", // Darker deep green for hover states
        "wf-yellow": "#038203", // Green accent (was yellow)
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
