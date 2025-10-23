import {ConfigProvider} from 'antd-mobile';
import {ThemeContext} from "../ThemeContext.jsx";
import {themes} from "../theme/themes.js";

const ThemeProvider = ({children, themeKey = 'light'}) => {
    const theme = themes[themeKey] || themes.light;

    return (
        <ThemeContext.Provider value={theme}>
            <ConfigProvider theme={theme}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
