import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { THEME_KEY } from '../utils/constants';
import { readPreference, writePreference } from '../utils/storage';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [preference, setPreference] = useState(() => {
        const saved = readPreference(THEME_KEY);
        return saved === 'true' ? true : saved === 'false' ? false : null;
    });
    const [systemDark, setSystemDark] = useState(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const darkMode = preference ?? systemDark;

    useEffect(() => {
        document.documentElement.classList.toggle('darkmode', darkMode);
    }, [darkMode]);
    useEffect(() => {
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        const change = (event: MediaQueryListEvent) =>
            setSystemDark(event.matches);
        query.addEventListener('change', change);
        return () => query.removeEventListener('change', change);
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                toggleDarkMode: () => {
                    writePreference(THEME_KEY, String(!darkMode));
                    setPreference(!darkMode);
                },
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
