import { createContext, useContext } from 'react';
import type { ThemeContextType } from '../types/context/ThemeContextType';
export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}
