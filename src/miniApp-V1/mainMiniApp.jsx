import styles from "./miniapp.module.css";
import Spinner from "../Cifrotech-app/components/Spinner.jsx";
import useTelegram from "./sdk/hook/useTelegram.jsx";
import MobileLayout from "./sdk/component/MobileLayout.jsx";

const MainMiniApp = () => {
    const {hasTelegram, safeTopOffset, isMobile} = useTelegram();

    const isReady = hasTelegram && (!isMobile || safeTopOffset !== 0);

    if (!isReady) {
        return (
            <div className={styles.container} style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
            }}>
                <Spinner/>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{paddingTop: safeTopOffset}}>
            <MobileLayout/>
        </div>
    );
};

export default MainMiniApp;
