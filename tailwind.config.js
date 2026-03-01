/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark:    '#0a0e1a',
          darker:  '#060910',
          card:    '#111827',
          border:  '#1f2937',
          accent:  '#00d4ff',
          green:   '#00ff88',
          red:     '#ff4444',
          yellow:  '#ffd700',
          muted:   '#6b7280',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}