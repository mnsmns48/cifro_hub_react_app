import styles from './miniapp.module.css';
import Spinner from '../Cifrotech-app/components/Spinner.jsx';
import LoremIpsum from "./sdk/component/LoremIpsum.jsx";
import MiniAppMenuBar from "./sdk/component/MiniAppMenuBar.jsx";
import SearchLine from "./sdk/component/SearchLine.jsx";
import {useState} from "react";
import useAppEnvironment from "./sdk/hook/useAppEnvironment.jsx";


const MainMiniApp = () => {
    const {hasTelegram, isMobile, insets, theme, viewportHeight} = useAppEnvironment();
    const [searchHeight, setSearchHeight] = useState(0);

    const isReady = hasTelegram && (!isMobile || insets.top !== 0);
    const safeTop = insets?.top ?? '0px';
    if (!isReady) {
        return (
            <div className={styles.centeredSpinner}>
                <Spinner/>
            </div>
        );
    }

    return (
        <>
            <div className={styles.appWrapper} style={{paddingTop: safeTop, backgroundColor: theme?.colorBackground}}></div>
            <div className={styles.searchWrapper} style={{backgroundColor: theme?.colorBackground, top: safeTop}}>
                <SearchLine onHeightChange={setSearchHeight}/>
            </div>
            <div style={{paddingTop: `calc(${safeTop} + 5px + ${searchHeight}px)`}}>
                <LoremIpsum/>
            </div>

            {/*<MiniAppMenuBar*/}
            {/*    contentInsets={insets}*/}
            {/*    theme={theme}*/}
            {/*    viewportHeight={viewportHeight}*/}
            {/*/>*/}

        </>
    );
};

export default MainMiniApp;
