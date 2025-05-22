import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserDataProvider } from './contexts/UserData';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <UserDataProvider>
                <App />
            </UserDataProvider>
        </ThemeProvider>
    </StrictMode>
);
