import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api2/': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    // build: {
    //     outDir: '/scr/cifro_hub_react_app/build',
    //     sourcemap: false,
    //     cssCodeSplit: true,
    // },
    // define: {
    //     'process.env.NODE_ENV': '"production"',
    // },
});