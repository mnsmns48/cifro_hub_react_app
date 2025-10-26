import { useEffect, useState } from "react";
import { ConfigProvider } from "antd-mobile";
import { ThemeContext } from "./ThemeContext.jsx";
import { themes } from "./themes.js";
import { resolveThemeKey } from "./resolveThemeKey.js";
import { applyAntdMobileTheme } from "./applyAntdMobileTheme.js";

const ThemeProvider = ({ children }) => {
    const [themeKey] = useState(resolveThemeKey());
    const theme = themes[themeKey] ?? themes.light;

    useEffect(() => {
        applyAntdMobileTheme(theme);
        document.body.dataset.theme = themeKey;

        // --- системная цветовая схема формируется из активной темы ---
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = theme.colorBackground;
        document.head.appendChild(meta);

        const style = document.createElement("style");
        // color-scheme ставим light, но можем подставить dynamic
        style.innerHTML = `
            :root {
                color-scheme: ${themeKey === 'dark' ? 'dark' : 'light'};
                background: ${theme.colorBackground};
            }
        `;
        document.head.appendChild(style);

        return () => {
            meta.remove();
            style.remove();
        };
    }, [theme, themeKey]);

    return (
        <ThemeContext.Provider value={theme}>
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;