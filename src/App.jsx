import {Layout, theme} from 'antd';
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppContent from "./components/AppContent.jsx";
import {useState} from "react";
import InStockMenu from "./components/instock/InStock.jsx";
import HubMenu from "./components/hub/HubMenu.jsx";

const {Sider} = Layout;

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
                    <Sider style={{textAlign: 'center'}}>
                        {showInStockMenu ? <InStockMenu/> : <HubMenu/>}
                    </Sider>
                    <AppContent/>
                </Layout>
                <AppFooter/>
            </Layout>
        </>
    );
};