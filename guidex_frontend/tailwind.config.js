/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    400: '#fbbf24', // Added missing 400
                    500: '#facc15', // Yellow Gold
                    600: '#eab308',
                    700: '#a16207',
                    900: '#422006',
                },
                cinematic: {
                    950: '#050505', // Deepest Black
                    900: '#0a0a0a',
                    800: '#111111',
                    700: '#1a1a1a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
