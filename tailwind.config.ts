import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      
      images: {
        domains: ["josseycodes-academy.onrender.com"],
      },

      colors: {
        josseypink8: "#eff6ff",
        josseypink2: "#dbeafe",
        josseypink3: "#bfdbfe",
        josseypink4: "#93c5fd",
        josseypink5: "#60a5fa",
        josseypink6: "#3882f1",
        josseypink7: "#2563eb",
        josseypink1: "#1d4ed8",
        josseypink9: "#1e40af",
        josseypink10: "#1e3a8a",
      },
    },
  },
  plugins: [],
};
export default config;