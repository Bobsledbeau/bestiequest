/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lavender: '#E0BBE4',
        mint: '#A8E6CF',
        peach: '#FFD3B6',
        sky: '#A1C4FF',
        butter: '#FFF9B1',
        purple: '#D4A5FF',
      }
    }
  },
  plugins: [],
}
