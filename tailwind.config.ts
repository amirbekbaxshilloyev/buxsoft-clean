import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1F4D",
          navydeep: "#060F26",
          blue: "#1E63FF",
          bluelight: "#5B8CFF",
          gold: "#C9A54B",
          goldlight: "#E3C87E"
        }
      },
      boxShadow: {
        glow: "0 0 80px rgba(30,99,255,.28)"
      }
    }
  },
  plugins: []
};
export default config;
