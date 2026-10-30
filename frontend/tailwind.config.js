/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0b1622",
          900: "#0f1b2a",
          800: "#16283d",
          700: "#1f374f",
        },
        accent: {
          500: "#3db4f2",
          600: "#2b9fe0",
        },
      },
    },
  },
  plugins: [],
};
