/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-background': 'var(--PRIMARY_BACKGROUND_COLOR)',
        'light-text-color': 'var(--TEXT_LIGHT_COLOR)',
        'line-color': 'var(--LINE_COLOR)',
        'primary-color': '#FFC31B',
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}
