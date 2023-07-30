/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  plugins: [],
  theme: {
    extend: {
      // TODO: src/側の変数を使い回せるようにする
      colors: {
        primary: '#fbbf24',
        secondary: '#60a5fa'
      }
    }
  }
}
