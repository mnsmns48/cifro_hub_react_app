import styles from "./miniapp.module.css";
import Spinner from "../Cifrotech-app/components/Spinner.jsx";
import MiniAppMenuBar from "./sdk/component/MiniAppMenuBar.jsx";
import SearchLine from "./sdk/component/SearchLine.jsx";
import {useState} from "react";
import useAppEnvironment from "./sdk/hook/useAppEnvironment.jsx";
import menuElementsObj from "./menuElements.jsx";
import ContentArea from "./sdk/component/ContentArea.jsx";

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
    const [menuActiveTab, setMenuActiveTab] = useState(null);


    const isReady = hasTelegram && (isMobile || insets.top !== 0);
    const safeTop = insets?.top ?? "0px";
    const safeBottom = insets?.bottom ?? "0px";
    const safeLeft = insets?.left ?? "0px";
    const safeRight = insets?.right ?? "0px";


    const keyboardOpenNow = isKeyboardOpen();

    const bottomNow = keyboardOpenNow
        ? safeBottom
        : `calc(${menuHeight + 2}px + ${safeBottom})`;


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
                 style={{backgroundColor: theme?.colorBackground, paddingTop: safeTop}}/>
            <div className={styles.searchWrapper} style={{backgroundColor: theme?.colorBackground, top: safeTop}}>
                <SearchLine onHeightChange={setSearchHeight} theme={theme}/>
            </div>
            {searchHeight > 0 && (
                <div className={styles.scrollArea}
                     style={{
                         top: `calc(${safeTop} + ${searchHeight}px + 15px)`,
                         left: `calc(${safeLeft} + 10px)`,
                         right: `calc(${safeRight} + 10px)`,
                         bottom: bottomNow
                     }}>
                    <ContentArea theme={theme} menuActiveTab={menuActiveTab}/>
                </div>
            )}

            <MiniAppMenuBar insets={insets} theme={theme} onHeightChange={setMenuHeight}
                            keyboardOpen={keyboardOpenNow} onTabChange={setMenuActiveTab}
                            menuElements={menuElementsObj}/>

        </>
    );
};

export default MainMiniApp;
