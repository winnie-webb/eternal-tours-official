/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Company green with Jamaican gold: jungle-green ink, emerald brand
        // ("jett"), and the logo's sun and sunset for highlights.
        ink: {
          DEFAULT: "#0E2A21",
          soft: "#1E3D32",
          muted: "#5A6E66",
        },
        jett: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        sun: {
          100: "#FFF1D1",
          300: "#FFD27A",
          400: "#FBBA3E",
          500: "#F5A524",
        },
        sunset: {
          400: "#FF8A4C",
          500: "#F26B1D",
          600: "#D65712",
        },
        sand: {
          50: "#FFFCF6",
          100: "#FBF6EC",
          200: "#F3EADA",
          300: "#E6D9C2",
        },
        palm: {
          500: "#11806A",
          600: "#0C6855",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        ticket: "0 1px 0 rgba(14,42,33,0.04), 0 12px 32px -12px rgba(14,42,33,0.18)",
        lift: "0 24px 48px -20px rgba(14,42,33,0.35)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        drift: "drift 40s linear infinite",
      },
    },
  },
  plugins: [],
};
