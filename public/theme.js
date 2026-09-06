// Runs before the stylesheet to respect an explicit light preference on dark systems.
(() => {
    let preference = null;
    try {
        preference = localStorage.getItem('darkMode');
    } catch {
        /* Storage may be blocked. */
    }
    const dark =
        preference === 'true' ||
        (preference !== 'false' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('darkmode', dark);
})();
