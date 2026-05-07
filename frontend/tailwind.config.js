/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
    extend: {
      colors: {
        nova: {
          bg: '#0d0d0d',
                      sidebar: '#171717',
                      border: '#2a2a2a',
                      accent: '#00D4FF',
                      'accent-hover': '#00b8d9',
                      text: '#ececec',
                      muted: '#8e8ea0',
                      bubble: '#2a2a2a',
                      hover: '#1f1f1f',
            },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
                  'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
          },
                keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' }, '40%': { opacity: '1', transform: 'scale(1)' } },
                  },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#ececec',
                          '--tw-prose-headings': '#ffffff',
                          '--tw-prose-code': '#00D4FF',
              },
        },
      },
                },
                },
  plugins: [],
    };
