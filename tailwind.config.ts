import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: "#0A0A0F",
          midnight: "#0B0F1A",
          card: "rgba(255, 255, 255, 0.03)",
          glass: "rgba(255, 255, 255, 0.05)",
        },
        accent: {
          purple: "#7C5CFC",
          cyan: "#3BC9DB",
          mint: "#9AE6B4",
        },
        text: {
          primary: "#F1F1F1",
          secondary: "#A0A0B0",
          muted: "#6B6B80",
          inverse: "#0A0A0F",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          glass: "rgba(255, 255, 255, 0.12)",
        },
      },
      spacing: {
        section: "100vh",
        gutter: "24px",
        "gutter-lg": "48px",
      },
      maxWidth: {
        container: "1200px",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.03em",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
        md: "0 4px 16px rgba(0, 0, 0, 0.4)",
        lg: "0 8px 32px rgba(0, 0, 0, 0.5)",
        glow: "0 0 20px rgba(124, 92, 252, 0.15)",
        "glow-cyan": "0 0 20px rgba(59, 201, 219, 0.15)",
      },
      backdropBlur: {
        glass: "16px",
      },
      backgroundImage: {
        "gradient-dark":
          "linear-gradient(180deg, #0A0A0F 0%, #0B0F1A 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
