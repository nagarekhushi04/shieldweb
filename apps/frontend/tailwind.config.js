/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        slate: '#1E293B',
        'primary-blue': '#3B82F6',
        'threat-red': '#EF4444',
        'safe-green': '#10B981',
        'warning-amber': '#F59E0B'
      }
    },
  },
  plugins: [],
}
