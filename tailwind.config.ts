import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Intentionally dark + neon — vibes
        surface: "#0f0f0f",
        card: "#1a1a1a",
        border: "#2a2a2a",
        accent: "#7c3aed",   // purple
        "accent-hot": "#ec4899", // pink for hot posts
      },
    },
  },
  plugins: [],
};

export default config;
