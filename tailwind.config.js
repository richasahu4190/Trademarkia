/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
      },
      colors: {
        primaryColor: "rgba(24, 77, 138, 1)",
        secondaryColor: "#0f172a",
        aqua: "#00ffff",
        turquoise: "#008080",
        ashGray: "#666666",
        gelBlue: "#299BC6",
      },
      boxShadow: {
        customShadow1: "2px 2px 2px 2px lightgray",
        customShadow2: "2px 2px 4px 8px lightgray",
        customShadow3: "0px 2px 2px 1px lightgray",
        customShadow4: "1px 1px 3px 0px #000",
        customShadow5: "0px 4.34px 68px 0px #C6C6C647",
        customShadow6: "0px 0px 7px 1.5px #66b3ff",
        customShadow7: "#00BFBF 0 1px 7px",
      },
    },
  },
  plugins: [],
  variants: {
    extend: {},
  },
};
