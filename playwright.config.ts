import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    workers: 3,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: { baseURL: 'http://127.0.0.1:5196', trace: 'retain-on-failure' },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ],
    webServer: {
        command: 'npm run build && node tests/serve.mjs',
        url: 'http://127.0.0.1:5196',
        reuseExistingServer: false,
        timeout: 60000,
    },
});
