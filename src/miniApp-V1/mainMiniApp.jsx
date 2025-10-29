import styles from './miniapp.module.css';
import Spinner from '../Cifrotech-app/components/Spinner.jsx';
import useTelegram from './sdk/hook/useTelegram.jsx';
import LoremIpsum from "./sdk/component/LoremIpsum.jsx";
import MiniAppMenuBar from "./sdk/component/MiniAppMenuBar.jsx";
import SearchLine from "./sdk/component/SearchLine.jsx";


// const AppContainer = ({children, contentInsets}) => {
//     const safeTop = contentInsets?.top ?? 0;
//     const safeBottom = contentInsets?.bottom ?? 0;
//     return (
//         <div className={styles.miniAppContainer}
//              style={{
//                  paddingTop: `calc(${safeTop}px + env(safe-area-inset-top, 0px))`,
//                  paddingBottom: `calc(${safeBottom}px + env(safe-area-inset-bottom, 0px))`,
//              }}>
//             {children}
//             <style>{`div::-webkit-scrollbar { display: none; }`}</style>
//         </div>
//     )
// }

const MainMiniApp = () => {
    const {hasTelegram, isMobile, insets, contentInsets, theme, viewportHeight} = useTelegram();

    const isReady = hasTelegram && (!isMobile || insets.top !== 0);
    const safeTop = insets?.top ?? 0;
    if (!isReady) {
        return (
            <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000}}>
                <Spinner/>
            </div>
        );
    }

    return (
        <>
            <div className={styles.appWrapper}
                 style={{
                     paddingTop: `calc(${safeTop}px + env(safe-area-inset-top, 0px))`,
                     backgroundColor: '#fff',
                 }}>
                <SearchLine insets={insets} isMobile={isMobile}/>
            </div>
            <div style={{
                paddingTop: `calc(${safeTop}px + env(safe-area-inset-top, 0px) - 10px)`
            }}>


            <LoremIpsum/>
            </div>
            <MiniAppMenuBar
                contentInsets={contentInsets}
                theme={theme}
                viewportHeight={viewportHeight}
            />

        </>
    );
};

export default MainMiniApp;
