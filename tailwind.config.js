import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ooi-dark-blue': "#09468b",
        'ooi-second-blue': "#1e77ba",
        'ooi-light-blue': '#d3ebfb',
        'ooi-text-white': '#ecf2ef',
        'ooi-text-dark': '#09468b',
        'ooi-pink': '#fe6e9a',
        'ooi-purple': '#6b3c8c',
        'ooi-yellow': '#faee50',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} 