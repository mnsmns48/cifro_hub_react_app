import {Layout, theme} from 'antd';
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppSider from "./components/AppSider.jsx";
import AppContent from "./components/AppContent.jsx";
import {useState} from "react";


export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken()
    const [showInStockMenu, setShowInStockMenu] = useState(false);
    const handleInStockButtonClick = () => {
        setShowInStockMenu(!showInStockMenu); // Переключаем состояние
    };
    return (<>
            <Layout>
                <AppHeader onInStockButtonClick={handleInStockButtonClick}/>
                <Layout style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <AppSider showInStockMenu={showInStockMenu}/>
                    <AppContent/>
                </Layout>
                <AppFooter/>
            </Layout>
        </>
    );
};