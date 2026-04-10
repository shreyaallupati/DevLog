/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    text: "var(--text)",
                    heading: "var(--text-h)",
                    bg: "var(--bg)",
                    border: "var(--border)",
                    code: "var(--code-bg)",
                    accent: "var(--accent)",
                    "accent-bg": "var(--accent-bg)",
                    "accent-border": "var(--accent-border)",
                    social: "var(--social-bg)",
                }
            },
            fontFamily: {
                sans: ['system-ui', '"Segoe UI"', 'Roboto', 'sans-serif'],
                heading: ['system-ui', '"Segoe UI"', 'Roboto', 'sans-serif'],
                mono: ['ui-monospace', 'Consolas', 'monospace'],
            },
            maxWidth: {
                container: "800px",
                form: "400px",
            },
            boxShadow: {
                theme: "var(--shadow)",
            }
        },
    },
    plugins: [],
}