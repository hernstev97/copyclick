import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ThemeContextType } from '../types/context/ThemeContextType';
import { THEME_KEY } from '../utils/constants';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // Initialize state from localStorage or system preference
    const [darkMode, setDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem(THEME_KEY);
        if (savedPreference !== null) {
            return savedPreference === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Track if user has manually set a preference
    const [hasUserPreference, setHasUserPreference] = useState(() => 
        localStorage.getItem(THEME_KEY) !== null
    );

    // Apply theme class to document
    useEffect(() => {
        document.documentElement.classList.toggle('darkmode', darkMode);
    }, [darkMode]);

    // Handle system preference changes
    useEffect(() => {
        if (hasUserPreference) return;

        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (evt: MediaQueryListEvent) => {
            setDarkMode(evt.matches);
        };

        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, [hasUserPreference]);

    // Toggle function
    const toggleDarkMode = useCallback(() => {
        setHasUserPreference(true);
        setDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem(THEME_KEY, String(newValue));
            return newValue;
        });
    }, []);

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
