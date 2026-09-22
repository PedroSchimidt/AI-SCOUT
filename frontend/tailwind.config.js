/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        pitch: {
          950: "#0a1612",
          900: "#0f221c",
          800: "#163028",
          700: "#1e4034",
          line: "#3d9970",
          glow: "#5eead4",
        },
        surface: {
          DEFAULT: "rgba(15, 34, 28, 0.72)",
          border: "rgba(94, 234, 212, 0.12)",
          hover: "rgba(94, 234, 212, 0.08)",
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(94, 234, 212, 0.35)",
        card: "0 8px 32px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
