import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background-rgb))',
        foreground: 'rgb(var(--foreground-rgb))',
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb))',
          foreground: 'rgb(var(--primary-foreground-rgb))',
        },
        border: 'rgb(var(--border-rgb))',
      },
      spacing: {
        'sidebar': '16rem', // 256px
      },
    },
  },
  plugins: [],
}

export default config 