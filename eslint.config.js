import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist', 'test-results', 'playwright-report']),
    {
        files: ['**/*.{js,mjs}'],
        extends: [js.configs.recommended],
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: { globals: globals.browser },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
    },
    {
        files: ['*.{js,mjs,ts}', 'tests/**/*.{js,mjs,ts}'],
        languageOptions: { globals: globals.node },
    },
    {
        files: ['public/*.js'],
        extends: [js.configs.recommended],
        languageOptions: { globals: globals.browser },
    },
]);
