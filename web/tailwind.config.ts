import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0D0B1E",
                "background-secondary": "#1A1730",
                surface: "#251F47",
                primary: {
                    DEFAULT: "#FF6B35",
                    light: "#FF8A5C",
                    dark: "#E55A25",
                },
                secondary: {
                    DEFAULT: "#7C3AED",
                    light: "#9F67FF",
                    dark: "#5B21B6",
                },
                accent: {
                    DEFAULT: "#FFD700",
                    light: "#FFE44D",
                },
                glass: "rgba(255, 255, 255, 0.08)",
                "glass-border": "rgba(255, 255, 255, 0.12)",
            },
            backgroundImage: {
                "gradient-cosmic": "linear-gradient(to bottom, #0D0B1E, #1A1730, #251F47)",
                "gradient-primary": "linear-gradient(to right, #FF6B35, #FF3366, #7C3AED)",
                "gradient-gold": "linear-gradient(to right, #FFD700, #FFA500)",
            },
            borderRadius: {
                xl: "16px",
                "2xl": "24px",
            },
            boxShadow: {
                glow: "0 0 20px rgba(255, 107, 53, 0.4)",
                "glow-purple": "0 0 20px rgba(124, 58, 237, 0.4)",
            },
        },
    },
    plugins: [],
};

export default config;
