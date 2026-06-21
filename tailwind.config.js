/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        flow: {
          50: "#e8f4ff",
          100: "#d0e8ff",
          200: "#a3d1ff",
          300: "#6bb5ff",
          400: "#389dff",
          500: "#1a8cff",
          600: "#0d74e8",
          700: "#0a5fc0",
          800: "#0d4d99",
          900: "#11407d",
        },
        pitch: {
          400: "#3dd68c",
          500: "#00b050",
          600: "#009645",
          700: "#007a38",
        },
        ink: {
          600: "#3a3a3a",
          700: "#2a2a2a",
          800: "#1a1a1a",
          900: "#0f1117",
        },
        paper: {
          DEFAULT: "#f2f2f2",
          white: "#fafafa",
        },
      },
      fontFamily: {
        sans: [
          "Inter Tight",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Anton",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px -8px rgba(0, 0, 0, 0.1)",
        paper: "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "green-brush": "url('/images/brand/greenpaint.png')",
        "black-brush": "url('/images/brand/blackpaint.png')",
        "paper-white": "url('/images/brand/rippedpaper2.png')",
        "paper-gray": "url('/images/brand/rippedpaper1.png')",
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.45" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-bar": {
          "0%": { width: "0%" },
        },
      },
      animation: {
        ripple: "ripple 0.6s ease-out",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "grow-bar": "grow-bar 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
