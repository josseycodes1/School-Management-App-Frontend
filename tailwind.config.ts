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
      colors: {
        lamaSky: "#F699CD",
        lamaSkyLight: "##F699CD",
        josseypink1: "#FC46AA",
        josseypink2: "#2c2328ff",
        lamaYellow: "#FC46AA",
        lamaYellowLight: "#FC46AA",
      },
    },
  },
  plugins: [],
};
export default config;