/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kraken: {
          purple: '#7434f3',
          'purple-light': '#b494e6',
          lilac: '#bc91f7',
          light: '#F4F2F8', // off-white RGB(244, 242, 248)
          dark: '#0C0A10', // off-black RGB(12, 10, 16)
          'dark-med': '#1B1723', // dark medium RGB(27, 23, 35)
          med: '#CFBCEB', // medium RGB(207, 188, 235)
          'med-dark': '#251F42', // medium dark RGB(37, 31, 66)
        },
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
}

