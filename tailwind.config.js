/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./app.vue",
  ],
  theme: {
    fontFamily: {
      sans: [
        "SF Pro Display", // 首選 SF Pro Display
        "Roboto", // 次選 Roboto
        "ui-sans-serif", // 系統無襯線字體
        "system-ui", // 系統字體
        "-apple-system", // Apple 平台系統字體
        "BlinkMacSystemFont", // macOS 系統字體
        "Helvetica Neue", // 備選字體
        "Arial",
        "sans-serif", // 最後回退的無襯線字體
      ],
    },
    colors: {
      primary: {
        50: "#00CBDB",
        100: "#58FEFF",
        300: "#4657A5",
        400: "#0000a3",
        500: "#0000a3",
        600: "#0000a3",
        700: "#0000a3",
        800: "#0000a3",
        850: "#0000a3",
        900: "#0000a3",
      },
      secondary: {
        500: "#3B5AB0",
      },
      third: {
        500: "#55FE55",
      },
      gray: {
        500: "#A8A8A8",
      },
      danger: "#AA0000",
      white: "#FFFFFF",
      black: "#000000",
    },
    extend: {},
  },
  plugins: []
};
