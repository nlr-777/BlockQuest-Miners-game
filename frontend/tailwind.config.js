/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'mono': ['"Space Mono"', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#00F0FF',
          foreground: '#000000',
          hover: '#00C2CC',
        },
        secondary: {
          DEFAULT: '#BD00FF',
          foreground: '#FFFFFF',
          hover: '#9900CC',
        },
        background: {
          DEFAULT: '#0F172A',
          dark: '#020617',
          light: '#1E293B',
        },
        surface: {
          DEFAULT: '#1E293B',
          border: '#334155',
        },
        accent: {
          DEFAULT: '#FFD700',
          glow: '#FFEB3B',
        },
        success: {
          DEFAULT: '#10B981',
          glow: '#34D399',
        },
        error: {
          DEFAULT: '#EF4444',
          glow: '#F87171',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #00F0FF, 0 0 10px #00F0FF' },
          '50%': { boxShadow: '0 0 20px #00F0FF, 0 0 30px #00F0FF' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #000000',
        'retro-sm': '2px 2px 0px 0px #000000',
        'neon-cyan': '0 0 10px #00F0FF, 0 0 20px #00F0FF',
        'neon-purple': '0 0 10px #BD00FF, 0 0 20px #BD00FF',
        'neon-gold': '0 0 10px #FFD700, 0 0 20px #FFD700',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
