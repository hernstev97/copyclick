import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={
                darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
        >
            Change Theme {darkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;
