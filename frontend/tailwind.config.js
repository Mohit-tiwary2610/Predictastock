/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        mono:  ["Space Mono", "monospace"],
        orb:   ["Orbitron", "sans-serif"],
        body:  ["DM Sans", "sans-serif"],
      },
      colors: {
        cyan:   { DEFAULT: "#22d3ee", dark: "#06b6d4" },
        green:  { DEFAULT: "#10b981" },
        purple: { DEFAULT: "#a78bfa" },
        red:    { DEFAULT: "#ef4444" },
        amber:  { DEFAULT: "#f59e0b" },
      },
    },
  },
  plugins: [],
};
