import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const { version } = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: { ignored: ['**/playwright-report/**', '**/test-results/**'] },
    },
    define: {
        // Add build timestamp when building
        'import.meta.env.VITE_BUILD_DATE': JSON.stringify(
            new Date().toISOString()
        ),
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    },
});
