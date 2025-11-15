import {useContext} from 'react';
import {ThemeContext} from "./ThemeContext.jsx";


export const useCurrentTheme = () => {
    const theme = useContext(ThemeContext);

    if (!theme) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return theme;
};
