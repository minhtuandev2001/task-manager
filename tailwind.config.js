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
        "bgDark": "#191b1f",
        "bgDarkItem": "#32363a",
      },
      borderColor: {
        "graycustom": "#A8ABBD",
        "bluecustom": "#2384FF"
      }
    },
    screens: {
      "phone": "320px",
      "phone1.5": "448px",
      "phone2": "640px",
      "tablet": "768px",
      "tablet2": "996px",
      "laptop": "1024px",
      "laptop2": "1280px",
      "laptop3": "1440px"
    }
  },
  plugins: [],
  darkMode: "class"
}

