export const STORAGE_KEY = 'copyClickItems';
export const CURRENT_DATA_VERSION = '1.0.0'; // Increment this when making breaking changes

export const VERSION_MISMATCH_MESSAGE = 'CopyClick has been updated with new features. Your previous snippets have been cleared to ensure compatibility.';

export const THEME_KEY = 'darkMode';   

export const TEXTAREA_BUFFER = 10; // Buffer to prevent scrollbar from appearing
export const COPY_TOAST_DURATION = 800; // Duration in milliseconds to show the copy success toast
export const PASTE_TIMEOUT = 0; // Immediate execution for paste handling

export const MOTION_TRANSITION_DURATION = 0.3;
export const MOTION_TRANSITION = {
    type: "spring",
    stiffness: 200,
    damping: 25,
    mass: 0.5,
    duration: MOTION_TRANSITION_DURATION
};