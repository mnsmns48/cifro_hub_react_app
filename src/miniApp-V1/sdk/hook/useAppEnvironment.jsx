import useTelegram from "./useTelegram.jsx";
import {AppEnvironmentContext} from "../context.js";

const useAppEnvironment = () => {
    let tgData = useTelegram();

    const defaultData = {
        hasTelegram: false,
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        insets: {top: 0, bottom: 0, left: 0, right: 0},
        theme: {colorBackground: '#fff'},
        viewportHeight: window.innerHeight,
    };

    return tgData || defaultData;
}

const AppEnvironmentProvider = ({children}) => {
    const env = useAppEnvironment();
    return (
        <AppEnvironmentContext.Provider value={env}>
            {children}
        </AppEnvironmentContext.Provider>
    );
};


export default AppEnvironmentProvider;