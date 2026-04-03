/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-surface": "#191c1d",
        "secondary-fixed": "#8cf3f3",
        "secondary": "#006a6a",
        "on-secondary-container": "#007070",
        "inverse-primary": "#a9c7ff",
        "tertiary-fixed-dim": "#88d982",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "on-tertiary-fixed-variant": "#005312",
        "primary-container": "#005eb8",
        "primary-fixed-dim": "#a9c7ff",
        "on-secondary-fixed": "#002020",
        "inverse-on-surface": "#f0f1f2",
        "surface-container-low": "#f3f4f5",
        "outline": "#727783",
        "on-primary-fixed-variant": "#00468c",
        "on-primary": "#ffffff",
        "error": "#ba1a1a",
        "surface": "#f8f9fa",
        "surface-container-highest": "#e1e3e4",
        "surface-tint": "#005db6",
        "surface-container-high": "#e7e8e9",
        "background": "#f8f9fa",
        "on-secondary-fixed-variant": "#004f4f",
        "surface-container": "#edeeef",
        "surface-bright": "#f8f9fa",
        "surface-variant": "#e1e3e4",
        "on-surface-variant": "#424752",
        "primary-fixed": "#d6e3ff",
        "on-primary-fixed": "#001b3d",
        "tertiary": "#005412",
        "tertiary-container": "#1d6e25",
        "on-primary-container": "#c8daff",
        "on-background": "#191c1d",
        "surface-dim": "#d9dadb",
        "primary": "#00478d",
        "inverse-surface": "#2e3132",
        "on-tertiary-fixed": "#002204",
        "on-error": "#ffffff",
        "secondary-container": "#8cf3f3",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-container": "#9bee94",
        "on-secondary": "#ffffff",
        "secondary-fixed-dim": "#6fd7d6",
        "outline-variant": "#c2c6d4",
        "tertiary-fixed": "#a3f69c"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
