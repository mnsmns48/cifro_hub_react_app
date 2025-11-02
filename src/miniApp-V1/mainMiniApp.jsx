import styles from './miniapp.module.css';
import Spinner from '../Cifrotech-app/components/Spinner.jsx';
import LoremIpsum from "./sdk/component/LoremIpsum.jsx";
import MiniAppMenuBar from "./sdk/component/MiniAppMenuBar.jsx";
import SearchLine from "./sdk/component/SearchLine.jsx";
import {useState} from "react";
import useAppEnvironment from "./sdk/hook/useAppEnvironment.jsx";


const MainMiniApp = () => {
    const {hasTelegram, isMobile, insets, theme} = useAppEnvironment();
    const [searchHeight, setSearchHeight] = useState(0);
    const [menuHeight, setMenuHeight] = useState(0);

    const isReady = hasTelegram && (!isMobile || insets.top !== 0);
    const safeTop = insets?.top ?? '0px';
    const safeBottom = insets?.bottom ?? '0px';

    if (!isReady) {
        return <div className={styles.centeredSpinner}><Spinner/></div>;
    }

    return (
        <>
            <div className={styles.appWrapper}
                 style={{backgroundColor: theme?.colorBackground, paddingTop: safeTop}}></div>

            <div className={styles.searchWrapper} style={{backgroundColor: theme?.colorBackground, top: safeTop}}>
                <SearchLine onHeightChange={setSearchHeight}/>
            </div>

            {searchHeight > 0 && menuHeight > 0 && (
                <div className={styles.scrollArea}
                     style={{
                         top: `calc(${safeTop} + ${searchHeight}px + 15px)`,
                         bottom: `calc(${menuHeight}px + ${safeBottom})`
                     }}>
                    <LoremIpsum/>
                </div>
            )}

            <MiniAppMenuBar insets={insets} theme={theme} onHeightChange={setMenuHeight}/>
        </>

    );
};

export default MainMiniApp;
