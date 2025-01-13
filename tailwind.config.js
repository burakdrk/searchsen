/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{tsx,html}"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        "hover-bg": "rgba(83, 83, 95, 0.48)",
        "text-default": "#efeff1",
        "accent": "#a970ff",
      },
    },
  },
}
