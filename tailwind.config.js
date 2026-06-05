/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#338dff',
          600: '#1a6df5',
          700: '#1457e1',
          800: '#1746b6',
          900: '#193d8f',
          950: '#142757',
        },
        status: {
          approved: '#22c55e',
          pending: '#eab308',
          cancelled: '#3b82f6',
          rejected: '#ef4444',
          submitted: '#8b5cf6',
          closed: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
