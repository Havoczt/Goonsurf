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
        surface: "#080808",
        card: "#111111",
        border: "#1f1f1f",
        accent: "#00e5ff",
        "accent-dim": "#00b8cc",
        "accent-hot": "#ff4444",
      },
    },
  },
  plugins: [],
};

export default config;
