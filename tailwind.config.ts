import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
        heading: ['Nunito', 'Fredoka One', 'system-ui', 'sans-serif'],
        playful: ['Fredoka One', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        strong: 'var(--shadow-strong)',
        hover: 'var(--shadow-hover)',
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-primary-button': 'var(--gradient-primary-button)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "breathe": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
        },
        "bounce-once": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "25%": {
            transform: "translateY(-15px)",
          },
          "50%": {
            transform: "translateY(-7px)",
          },
          "75%": {
            transform: "translateY(-3px)",
          },
        },
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "jump": {
          "0%": {
            transform: "translateY(0) scale(1)",
          },
          "30%": {
            transform: "translateY(-20px) scale(1.1)",
          },
          "50%": {
            transform: "translateY(-25px) scale(1.15)",
          },
          "70%": {
            transform: "translateY(-10px) scale(1.05)",
          },
          "100%": {
            transform: "translateY(0) scale(1)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-success": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.1)",
          },
        },
        "wiggle": {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "float-delayed": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-15px)",
          },
        },
        "sway": {
          "0%, 100%": {
            transform: "rotate(-5deg)",
          },
          "50%": {
            transform: "rotate(5deg)",
          },
        },
        "sway-delayed": {
          "0%, 100%": {
            transform: "rotate(5deg)",
          },
          "50%": {
            transform: "rotate(-5deg)",
          },
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "spin-slow-reverse": {
          "0%": {
            transform: "rotate(360deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "breathe": "breathe 3s ease-in-out infinite",
        "bounce-once": "bounce-once 0.6s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "jump": "jump 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-success": "scale-success 0.4s ease-out",
        "wiggle": "wiggle 0.3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "float-delayed": "float-delayed 3s ease-in-out infinite 0.5s",
        "sway": "sway 4s ease-in-out infinite",
        "sway-delayed": "sway-delayed 4s ease-in-out infinite 0.7s",
        "spin-slow": "spin-slow 20s linear infinite",
        "spin-slow-reverse": "spin-slow-reverse 15s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
