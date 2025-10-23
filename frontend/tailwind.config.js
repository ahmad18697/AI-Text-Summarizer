/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 20px rgba(79, 70, 229, 0.35)'
      },
    },
  },
  plugins: [],
}
