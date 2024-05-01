/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "input": "#F6F7F9",
        "button": "#2384FF"
      },
      borderColor: {
        "graycustom": "#A8ABBD",
        "bluecustom": "#2384FF"
      }
    },
  },
  plugins: [],
}

