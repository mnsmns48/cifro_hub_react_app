import {ConfigProvider} from 'antd-mobile';
import {ThemeContext} from "./ThemeContext.jsx";
import {themes} from "./themes.js";
import {resolveThemeKey} from "./resolveThemeKey.js";
import {useEffect} from "react";
import {applyAntdMobileTheme} from "./applyAntdMobileTheme.js";

const ThemeProvider = ({children}) => {
    const themeKey = resolveThemeKey();
    const theme = themes[themeKey] ?? themes.light;

    useEffect(() => {
        applyAntdMobileTheme(theme);
    }, [theme]);


    return (
        <ThemeContext.Provider value={theme}>
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
