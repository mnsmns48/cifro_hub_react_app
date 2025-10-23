export const resolveThemeKey = () => {
    const stored = localStorage.getItem('themeKey');
    if (stored && ['light', 'dark', 'custom'].includes(stored)) {
        return stored;
    }

    const tg = window.Telegram?.WebApp;
    const tgScheme = tg?.colorScheme;
    if (tgScheme === 'dark') return 'dark';
    if (tgScheme === 'light') return 'light';

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    if (prefersDark) return 'dark';

    return 'light';
};


export const themes = {
    light: {
        colorPrimary: '#e7fe32',
        colorText: '#3a3a3a',
        colorBackground: '#ffffff',
        colorCard: '#f1f1f1',
        colorMuted: '#999999',
        colorBorder: '#e0e0e0',

        fontSizeBase: '14px',
        fontSizeSm: '12px',
        fontSizeLg: '16px',
        fontWeightNormal: '400',
        fontWeightBold: '600',
        fontFamilyBase: 'system-ui',

        spacingSm: '4px',
        spacingMd: '8px',
        spacingLg: '16px',
        radiusSm: '4px',
        radiusMd: '8px',

        elevationSm: '0 1px 2px rgba(0,0,0,0.05)',
        elevationMd: '0 4px 8px rgba(0,0,0,0.1)',

        transitionFast: '0.2s ease-in-out',
        transitionSlow: '0.4s ease-in-out',
    },

    dark: {
        ...this.light,
        colorBackground: '#1c1c1c',
        colorText: '#ffffff',
        colorPrimary: '#00ffcc',
        _placeholder: true,
    },

    custom: {
        ...this.light,
        colorPrimary: '#0088cc',
        colorBackground: '#f5faff',
        colorText: '#222222',
        _placeholder: true,
    },
};

