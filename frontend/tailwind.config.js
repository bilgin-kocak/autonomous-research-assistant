/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Figma Design System Colors
        background: {
          dark: '#0A0E1A',      // Deep navy, main background
          medium: '#151B2E',    // Card backgrounds
          light: '#1E2738',     // Elevated elements
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',       // Electric blue - research agent
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          500: '#8b5cf6',       // Purple - peer review agent
          600: '#7c3aed',
        },
        tertiary: {
          500: '#10b981',       // Emerald - data curator agent
          600: '#059669',
        },
        success: '#22c55e',     // Hypothesis approved
        warning: '#f59e0b',     // Pending review
        error: '#ef4444',       // Hypothesis rejected
        neutral: '#64748b',     // Inactive states
        text: {
          primary: '#f8fafc',   // White, high contrast
          secondary: '#94a3b8', // Gray, descriptions
          tertiary: '#64748b',  // Timestamps, metadata
          link: '#60a5fa',      // Interactive elements
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Domine', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'section': ['32px', { lineHeight: '40px', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
