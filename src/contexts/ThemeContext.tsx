import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // Initialize dark mode based on system preference
    const [darkMode, setDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem('darkMode');
        if (savedPreference !== null) {
            return savedPreference === 'true';
        }
        // Check if system prefers dark mode
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Apply dark mode class to body
        if (darkMode) {
            document.documentElement.classList.add('darkmode');
        } else {
            document.documentElement.classList.remove('darkmode');
        }

        localStorage.setItem('darkMode', String(darkMode));

        // Listen for changes in system color scheme preference
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (evt: MediaQueryListEvent) => {
            setDarkMode(evt.matches);
        };

        mq.addEventListener('change', handleChange);

        // Cleanup
        return () => {
            mq.removeEventListener('change', handleChange);
        };
    }, [darkMode]);

    // Toggle function
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
