const light = {
    colorPrimary: '#000000',
    colorText: '#3a3a3a',
    colorBackground: '#ffffff',

    colorMuted: '#999999',
    colorSecondary: '#707575',
    colorBorder: '#e0e0e0',
    colorCard: '#f1f1f1',
    colorLightGreen: "#e2fc2a",

    fontFamily: 'TT Firs Neue',
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
};

export const themes = {
    light,
    dark: {
        ...light,
        colorBackground: '#1c1c1c',
        colorText: '#ffffff',
        colorPrimary: '#00ffcc',
        _placeholder: true,
    },
    custom: {
        ...light,
        colorBackground: '#f5faff',
        colorText: '#222222',
        colorPrimary: '#0088cc',
        _placeholder: true,
    },
};
