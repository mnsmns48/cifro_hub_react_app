export const applyAntdMobileTheme = (theme) => {
    const set = (key, value) => {
        if (value) {
            document.documentElement.style.setProperty(key, value);
        }
    };


    set('--adm-color-primary', theme.colorPrimary);
    set('--adm-color-text', theme.colorText);
    set('--adm-color-background', theme.colorBackground);
    set('--adm-color-muted', theme.colorMuted);
    set('--adm-color-border', theme.colorBorder);


    set('--adm-border-radius', theme.radiusMd);


    set('--adm-font-size-main', theme.fontSizeBase);
    set('--adm-font-family', theme.fontFamilyBase);


    set('--adm-spacing-sm', theme.spacingSm);
    set('--adm-spacing-md', theme.spacingMd);
    set('--adm-spacing-lg', theme.spacingLg);


    set('--adm-transition-fast', theme.transitionFast);
    set('--adm-transition-slow', theme.transitionSlow);
};
