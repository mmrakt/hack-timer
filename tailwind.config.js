/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: '#fbbf24',
        secondary: '#60a5fa',
        dark: {
          100: '#0e1217',
          200: '#1c1f26',
          300: '#a8b3cf33'
        },
        light: {
          200: '#a8b3cf'
        }
      }
    }
  }
}
