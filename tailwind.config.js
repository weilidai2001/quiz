/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytesttheme: {
          "primary": "#ff0000",
          "secondary": "#00ff00",
          "accent": "#0000ff",
          "neutral": "#333333",
          "base-100": "#111111",
          "info": "#0099ff",
          "success": "#00ff99",
          "warning": "#ffcc00",
          "error": "#ff0066"
        }
      },
      "light", "dark"
    ],
    defaultTheme: "mytesttheme",
  },
}
