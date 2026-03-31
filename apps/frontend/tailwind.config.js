/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface': '#0b1326',
        'surface-low': '#131b2e',
        'surface-container': '#171f33',
        'surface-high': '#222a3d',
        'surface-variant': '#2d3449',
        'primary': '#adc6ff',
        'on-primary': '#002e6a',
        'secondary': '#bcc7de',
        'secondary-container': '#3e495d',
        'tertiary': '#4edea3',
        'on-tertiary': '#003824',
        'error': '#ffb4ab',
        'on-error': '#690005',
        'outline-variant': '#424754',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '1rem',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
