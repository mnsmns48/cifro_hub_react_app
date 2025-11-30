import {useContext} from 'react';
import {ThemeContext} from "../context.js";



export const useCurrentTheme = () => {
    const theme = useContext(ThemeContext);

    if (!theme) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return theme;
};
