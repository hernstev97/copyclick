import { useTheme } from '../contexts/ThemeContext';
import { INTERFACE_CONTENT } from '../utils/content';
import { useData } from '../contexts/UserData';

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    const { language } = useData();
    return (
        <button
            className="cc-button dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={
                darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
        >
            {INTERFACE_CONTENT[language].theme} {darkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;
