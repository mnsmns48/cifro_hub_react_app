import {useContext, useEffect} from "react";
import styles from "./miniapp.module.css";
import TelegramDebugPanel from "./sdk/component/TelegramDebugPanel.jsx";
import {ThemeContext} from "./sdk/theme/ThemeContext.jsx";
import {Spin} from "antd";
import {useTelegram} from "./sdk/hook/useTelegram.jsx";


const MainMiniApp = () => {
    const { hasTelegram, safeTopOffset, isMobile, isDesktop } = useTelegram()
    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (hasTelegram && window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor(theme.colorBackground);
            window.Telegram.WebApp.setBackgroundColor(theme.colorBackground);
        }
    }, [hasTelegram, theme]);


    return (
        <div className={styles.container} style={{paddingTop: safeTopOffset}}>
            {hasTelegram ? <TelegramDebugPanel/> : <Spin/>}
            <div style={{ marginTop: 16, fontSize: 14 }}>
                <strong>safeTopOffset:</strong> {safeTopOffset}
                <br />
                <strong>isMobile:</strong> {String(isMobile)}
                <br />
                <strong>isDesktop:</strong> {String(isDesktop)}
            </div>
        </div>

    );
};

export default MainMiniApp;
