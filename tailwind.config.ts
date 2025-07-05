import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./client/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#6B88D3",
        "accent": "#EFEFBB",
        "dark-blue": "#00008B",
        "bg-dark": "#0a0a1a",
        "bg-card": "#1a1a2e"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [],
};

export default config;
