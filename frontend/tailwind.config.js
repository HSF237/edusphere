/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        primary: '#00FF94',
        safe: '#00FF94',
        expiring: '#FF8A00',
        waste: '#FF3B30'
      }
    },
  },
  plugins: [],
}
