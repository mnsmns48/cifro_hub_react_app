export const resolveThemeKey = () => {
    // const stored = localStorage.getItem('themeKey');
    // if (stored && ['light', 'dark', 'custom'].includes(stored)) {
    //     return stored;
    // }
    //
    // const tg = window.Telegram?.WebApp;
    // const tgScheme = tg?.colorScheme;
    // if (tgScheme === 'dark') return 'dark';
    // if (tgScheme === 'light') return 'light';
    //
    // const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    // if (prefersDark) return 'dark';

    return 'light';
};
