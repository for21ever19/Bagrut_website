import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F9E4D4',
        ink: '#6B6644',
        'accent-gold': '#D9A521',
        'folder-history': '#E6B89C',
        'folder-civics': '#9FB8AD',
        'folder-tanakh': '#D4C5A8',
        'folder-lit': '#C7B2BE',
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'hand-drawn': '4px 4px 0px #6B6644',
        'hand-drawn-lg': '6px 6px 0px #6B6644',
      },
      dropShadow: {
        'hand-drawn': '4px 4px 0px #6B6644',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config

