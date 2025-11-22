import styles from "./miniapp.module.css";
import Spinner from "../Cifrotech-app/components/Spinner.jsx";
import MenuBar from "./sdk/component/MenuBar.jsx";
import SearchLine from "./sdk/component/SearchLine.jsx";
import {useState} from "react";
import useAppEnvironment from "./sdk/hook/useAppEnvironment.jsx";

import ContentArea from "./sdk/component/ContentArea.jsx";
import {miniAppConfig} from "./miniAppConf.jsx";
import useAppParams from "./sdk/hook/useAppParams.jsx";


const isKeyboardOpen = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return false;

    const active = document.activeElement;
    if (active) {
        const tag = active.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return true;
        if (active.isContentEditable) return true;
    }

    return false;
};

const MainMiniApp = () => {
    const {hasTelegram, isMobile, insets, theme} = useAppEnvironment();
    const [searchHeight, setSearchHeight] = useState(0);
    const [menuHeight, setMenuHeight] = useState(0);
    const [barTab, setBarTab] = useState(null);

    const isReady = hasTelegram && (isMobile || insets.top !== 0);
    const safeInsets = {
        top: insets?.top ?? "0px",
        bottom: insets?.bottom ?? "0px",
        left: insets?.left ?? "0px",
        right: insets?.right ?? "0px",
    };
    const params = useAppParams();

    const keyboardOpenNow = isKeyboardOpen();

    const bottomNow = keyboardOpenNow
        ? safeInsets.bottom
        : `calc(${menuHeight + 2}px + ${safeInsets.bottom})`;


    if (!isReady) {
        return (
            <div className={styles.centeredSpinner}>
                <Spinner/>
            </div>
        );
    }

    return (
        <>
            <div className={styles.appWrapper}
                 style={{backgroundColor: theme?.colorBackground, paddingTop: safeInsets.top}}/>
            <div className={styles.searchWrapper} style={{backgroundColor: theme?.colorBackground, top: safeInsets.top}}>
                <SearchLine onHeightChange={setSearchHeight}/>
            </div>
            {searchHeight > 0 && (
                <div className={styles.scrollArea}
                     style={{
                         top: `calc(${safeInsets.top} + ${searchHeight}px + 15px)`,
                         left: `calc(${safeInsets.left} + 10px)`,
                         right: `calc(${safeInsets.right} + 10px)`,
                         bottom: bottomNow
                     }}>
                    <ContentArea barTab={barTab} noImg={params?.noImg} safeInsets={safeInsets} />
                </div>
            )}

            <MenuBar insets={insets}
                     onHeightChange={setMenuHeight}
                     keyboardOpen={keyboardOpenNow}
                     onTabChange={setBarTab}
                     miniAppConfig={miniAppConfig}
            />
        </>
    );
};

export default MainMiniApp;
