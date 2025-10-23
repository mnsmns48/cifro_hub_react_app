import {useTelegramScriptLoader} from './sdk/hook/useTelegramScriptLoader.jsx';
import MobileLayout from "./sdk/component/MobileLayout.jsx";
import '/fonts/ttfirsneue/stylesheet.css';
import './miniapp.css'
import useTelegramWebApp from "./sdk/hook/useTelegramWebApp.jsx";


const MainMiniApp = () => {
    useTelegramScriptLoader();
    useTelegramWebApp()
    //
    // const {isTablet} = useDeviceLayout();

    // return isTablet ? <TabletLayout/> : <MobileLayout/>;
    return <MobileLayout/>
};

export default MainMiniApp;
