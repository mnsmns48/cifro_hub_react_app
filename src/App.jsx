import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Layout, theme} from 'antd';
import {useEffect, useState} from "react";
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppContent from "./components/AppContent.jsx";
import InStockMenu from "./components/instock/InStockMenu.jsx";
import HubMenu from "./components/hub/HubMenu.jsx";
import AppCarousel from "./components/AppCarousel.jsx";
import ProductDetail from "./components/ProductDetail.jsx";


const {Content, Sider} = Layout;

const MENU_TYPE = {
    IN_STOCK: {text: "Каталог НАЛИЧИЯ", endpoint: 'instock', component: InStockMenu},
    HUB: {text: "ХАБ ДОСТАВКИ", endpoint: 'hub', component: HubMenu}
};


export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();

    const [currentMenu, setCurrentMenu] = useState(MENU_TYPE.IN_STOCK);
    const [contentDataId, setContentDataId] = useState('');
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 480);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 480);
            if (window.innerWidth > 768) {
                setCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMainSwitchBtnClick = () => {
        setCurrentMenu((current) =>
            current === MENU_TYPE.HUB ? MENU_TYPE.IN_STOCK : MENU_TYPE.HUB
        );
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId);
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    };

    const WhiteStyle = {
        backgroundColor: colorBgContainer,
        borderRadius: borderRadiusLG,
    };

    const CurrentMenuComponent = currentMenu.component;

    // Логика видимости контента
    const contentVisible = !isSmallScreen || (isSmallScreen && collapsed);


    return (
        <Router>
            <AppHeader
                onMainSwitchBtnClick={handleMainSwitchBtnClick}
                toggleButtonText={currentMenu.text}
            />
            <Layout style={WhiteStyle}>
                <AppCarousel/>
                <Layout style={WhiteStyle}>
                    <Sider
                        breakpoint="md"
                        collapsedWidth="0"
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                        style={{textAlign: "left", background: "white"}}
                        trigger={<img src="/logo-cifro-hub.svg" alt="Menu Logo" className='menu-logo'/>}
                        width={270}>
                        <CurrentMenuComponent
                            onClick={handleContentCatalogId}
                            endpoint={currentMenu.endpoint}
                        />
                    </Sider>
                    {contentVisible && (
                        <Content>
                            <Routes>
                                <Route
                                    path="/"
                                    element={<AppContent contentDataId={contentDataId}/>}
                                />
                                <Route
                                    path="/:endpoint/:id"
                                    element={
                                        <AppContent
                                            contentDataId={contentDataId}
                                            endpoint={currentMenu.endpoint}
                                        />
                                    }
                                />
                                <Route
                                    path="/product/:productId"
                                    element={<ProductDetail/>}
                                />
                            </Routes>
                        </Content>
                    )}
                </Layout>
            </Layout>
            {!isSmallScreen && <AppFooter/>}
        </Router>
    )
        ;
}
