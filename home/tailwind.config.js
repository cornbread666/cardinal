/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "card": "0.8em 0.8em var(--fallback-b2,oklch(var(--a)/var(--tw-border-opacity)))"
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],

  daisyui: {
    themes: ["cupcake"],
  },
}

