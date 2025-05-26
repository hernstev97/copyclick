import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserDataProvider } from './contexts/UserData';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserDataProvider>
            <ThemeProvider>
                <App />
                <Analytics />
            </ThemeProvider>
        </UserDataProvider>
    </StrictMode>
);

// TODO: [MEDIUM] Add loading states for asynchronous operations
// PROBLEM: No loading indicators exist for operations like clipboard access
// or data persistence, leaving users uncertain about operation status.
// WHY: Users need feedback about system state to understand whether operations
// succeeded or are still in progress, especially important for accessibility.

// TODO: [MEDIUM] Implement proper keyboard navigation for copy functionality
// PROBLEM: Copy functionality in read-only mode only works with mouse clicks,
// excluding keyboard users from core application functionality.
// WHY: This violates accessibility standards and prevents users who rely on
// keyboard navigation from effectively using the application.

// @TODO: Implementing error boundaries and comprehensive error handling
// @TODO: Completing accessibility features (keyboard nav, ARIA, screen readers)
// @TODO: Adding a testing framework and writing tests
// @TODO: Implementing performance optimizations
// @TODO: Adding security measures
// @TODO: Setting up automated quality checks
