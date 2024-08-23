/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                paleta_1: {
                    DEFAULT: "#044261",
                },
                paleta_2: {
                    DEFAULT: "#1A7BB5",
                },
                paleta_3: {
                    DEFAULT: "#50C4CE",
                },
                paleta_4: {
                    DEFAULT: "#C70000",
                },
            },
        },
        plugins: [],
    },
};
