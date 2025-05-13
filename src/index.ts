const changeColorMode = (isDark: Boolean) => {
    if (isDark)
        document.body.classList.add('darkmode');
    else
        document.body.classList.remove('darkmode');
}

const mq = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = mq.matches;
changeColorMode(isDark);

mq.addEventListener('change', function (evt) {
    const isDark = evt.matches;
    changeColorMode(isDark);
});
