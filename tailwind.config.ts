import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Scudamore's Navy Ramp
        navy: {
          1000: '#0a1530',
          900:  '#14284b',
          700:  '#26467d',
          500:  '#3d68b0',
          300:  '#7e9bd5',
          100:  '#c2d0ec',
          50:   '#e7edf8',
        },
        // Scudamore's Cream Ramp
        cream: {
          400: '#d4c8a6',
          300: '#e6d9b3',
          200: '#f0e8cf',
          100: '#f8f3e3',
          75:  '#fcfaf3',
          50:  '#fefefd',
        },
        // Scudamore's Gold Accent
        gold: {
          700: '#9c7a2f',
          500: '#c9a24a',
          300: '#e3c277',
        },
        // shadcn/ui semantic tokens (mapped to brand)
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        display: ['"Gill Sans"', '"Gill Sans MT"', '"Lato"', 'Calibri', '"Trebuchet MS"', 'sans-serif'],
        sans:    ['Inter', '-apple-system', '"Segoe UI"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [animate],
}

export default config
