// Get build timestamp or use current time
export const getBuildDate = () => {
    // Use import.meta.env from Vite for build timestamp
    // Or fallback to current date if not in production
    const buildDate =
        import.meta.env.VITE_BUILD_DATE || new Date().toISOString();
    return new Date(buildDate);
};

// Format version with date in German format (DD.MM.YYYY)
export const getVersionString = () => {
    const date = getBuildDate();
    const version = import.meta.env.VITE_APP_VERSION || '0.3.0';

    // Format date as DD.MM.YYYY (German format)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    const germanDate = `${day}.${month}.${year}`;

    // Format: v0.3.0 (20.05.2024)
    return `Beta v${version} (${germanDate})`;
};
