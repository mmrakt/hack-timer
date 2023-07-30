import { COLOR } from './src/consts/color'

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: COLOR.primary,
        secondary: COLOR.secondary
      }
    }
  }
}
