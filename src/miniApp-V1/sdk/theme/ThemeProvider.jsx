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

        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = theme.colorBackground;
        document.head.appendChild(meta);

        const style = document.createElement("style");
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