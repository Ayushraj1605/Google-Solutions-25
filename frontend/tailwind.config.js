const nativewind = require("nativewind/preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/(auth)/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        main: "#9DC08B",
        options: "#609966",
        smallText: "#40513B",
        success: "#008000",
        secondary: "#353935",
        notselected: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
