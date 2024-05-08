/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "graycustom": "#A8ABBD",
      },
      backgroundColor: {
        "input": "#F6F7F9",
        "button": "#2384FF",
        "icon": "#F6F8FD",
      },
      borderColor: {
        "graycustom": "#A8ABBD",
        "bluecustom": "#2384FF"
      }
    },
  },
  plugins: [],
}

