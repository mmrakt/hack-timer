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
        secondary: COLOR.secondary,
        dark: {
          100: COLOR.dark[100],
          200: COLOR.dark[200],
          300: COLOR.dark[300],
          400: COLOR.dark[400]
        },
        light: {
          100: COLOR.light[100],
          200: COLOR.light[200],
          300: COLOR.light[300]
        }
      }
    }
  }
}
