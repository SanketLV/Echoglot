import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        // Background scale
        primary: '#000000',
        elevated: '#0A0A0A',
        surface: '#141414',
        muted: '#1A1A1A',
        subtle: '#202020',

        // Text scale
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-tertiary': '#6B6B6B',
        'text-muted': '#404040',
        'text-inverse': '#000000',

        // Border scale
        'border-default': 'rgba(255, 255, 255, 0.06)',
        'border-hover': 'rgba(255, 255, 255, 0.12)',
        'border-active': 'rgba(255, 255, 255, 0.20)',
        'border-accent': 'rgba(99, 102, 241, 0.40)',

        // Primary accent (Indigo)
        accent: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          glow: 'rgba(99, 102, 241, 0.25)',
        },

        // Secondary accent (Cyan / Live)
        live: {
          400: '#67E8F9',
          500: '#22D3EE',
          glow: 'rgba(34, 211, 238, 0.20)',
        },

        // Success (Emerald)
        success: {
          500: '#10B981',
          glow: 'rgba(16, 185, 129, 0.20)',
        },

        // Pop (Lime)
        pop: {
          400: '#E4FF8A',
          500: '#D4FF60',
          glow: 'rgba(212, 255, 96, 0.15)',
        },

        // Semantic
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',

        // Language indicator colors
        lang: {
          english: '#6366F1',
          spanish: '#F59E0B',
          french: '#3B82F6',
          german: '#EF4444',
          japanese: '#EC4899',
          mandarin: '#F97316',
          hindi: '#8B5CF6',
          arabic: '#14B8A6',
          portuguese: '#22C55E',
          korean: '#E879F9',
        },
      },

      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },

      fontSize: {
        // Landing page
        'display-xl': ['72px', { lineHeight: '76px', letterSpacing: '-0.04em' }],
        'display-lg': ['56px', { lineHeight: '62px', letterSpacing: '-0.03em' }],
        'display-md': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        'heading-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        'heading-md': ['24px', { lineHeight: '32px' }],
        'heading-sm': ['20px', { lineHeight: '28px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '26px' }],
        'body-sm': ['14px', { lineHeight: '22px' }],
        'body-xs': ['12px', { lineHeight: '18px' }],
        // App UI
        'app-title': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'app-heading': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'app-body': ['15px', { lineHeight: '24px' }],
        'app-caption': ['13px', { lineHeight: '20px' }],
        'app-tiny': ['11px', { lineHeight: '16px', fontWeight: '500' }],
        'app-mono': ['14px', { lineHeight: '22px' }],
      },

      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
        '34': '136px',
      },

      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.35)',
        'glow-live': '0 0 20px rgba(34, 211, 238, 0.20)',
      },

      backdropBlur: {
        glass: '12px',
        'glass-lg': '24px',
      },

      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },

      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },

      backgroundImage: {
        'gradient-hero':
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        'gradient-card-hover':
          'radial-gradient(ellipse at 20% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
        'gradient-voice-active':
          'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.20) 0%, transparent 60%)',
        'gradient-cta': 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #6366F1 100%)',
        'gradient-border':
          'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(34, 211, 238, 0.4) 100%)',
      },

      width: {
        sidebar: '280px',
        'sidebar-collapsed': '72px',
        'right-panel': '320px',
        chat: '720px',
      },

      maxWidth: {
        content: '1280px',
        chat: '720px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
