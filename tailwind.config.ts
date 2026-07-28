import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EC",
        ink: "#2D2A55",
        bubblegum: {
          DEFAULT: "#FF6FA5",
          dark: "#E5468A",
          light: "#FFE1EE",
        },
        sunshine: {
          DEFAULT: "#FFCC33",
          dark: "#F5A623",
          light: "#FFF3D1",
        },
        lagoon: {
          DEFAULT: "#33D6C4",
          dark: "#1FAE9E",
          light: "#D6FBF6",
        },
        grass: {
          DEFAULT: "#6FCF7A",
          dark: "#4EAE5A",
          light: "#E1F8E3",
        },
        berry: {
          DEFAULT: "#8E6FE0",
          dark: "#6E4FC0",
          light: "#EDE5FF",
        },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "2rem",
      },
      boxShadow: {
        chunky: "0 6px 0 0 rgba(45,42,85,0.15)",
        "chunky-sm": "0 4px 0 0 rgba(45,42,85,0.15)",
        pop: "0 10px 30px -10px rgba(45,42,85,0.35)",
      },
      keyframes: {
        wobble: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        wobble: "wobble 2.4s ease-in-out infinite",
        pop: "pop 0.35s ease-in-out",
        float: "float 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
