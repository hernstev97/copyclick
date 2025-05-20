import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // Add build timestamp when building
        'import.meta.env.VITE_BUILD_DATE': JSON.stringify(
            new Date().toISOString()
        ),
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(
            process.env.npm_package_version || '0.3'
        ),
    },
});
