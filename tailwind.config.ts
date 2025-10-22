import type { Config } from "tailwindcss";

// TailwindCSS 4.x - Minimal config
// Theme customization is now done in CSS using @theme directive
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("@tailwindcss/typography")],
};

export default config;
