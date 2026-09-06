import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserDataProvider } from './contexts/UserData';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserDataProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </UserDataProvider>
        {import.meta.env.PROD &&
            import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && (
                <>
                    <Analytics />
                    <SpeedInsights />
                </>
            )}
    </StrictMode>
);
