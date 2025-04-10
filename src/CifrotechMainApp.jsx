import './CifrotechMainApp.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Layout, theme} from 'antd';
import {useEffect, useState} from "react";
import AppHeader from "./Cifrotech-app/components/AppHeader.jsx";
import AppFooter from "./Cifrotech-app/components/AppFooter.jsx";
import AppContent from "./Cifrotech-app/components/AppContent.jsx";
import InStockMenu from "./Cifrotech-app/components/instock/InStockMenu.jsx";
import HubMenu from "./Cifrotech-app/components/hub/HubMenu.jsx";
import AppCarousel from "./Cifrotech-app/components/AppCarousel.jsx";
import ProductDetail from "./Cifrotech-app/components/ProductDetail.jsx";
import LogoIconButtonSVG from "./Cifrotech-app/components/svg_jsx/LogoIconButtonSVG.jsx";
import LogoMenuButtonSVG from "./Cifrotech-app/components/svg_jsx/LogoMenuButtonSVG.jsx";
import Address from "./Cifrotech-app/components/Address.jsx";

const {Content, Sider} = Layout;

const MENU_TYPE = {
    IN_STOCK: {text: "Каталог НАЛИЧИЯ", endpoint: 'instock', component: InStockMenu},
    HUB: {text: "ХАБ ДОСТАВКИ", endpoint: 'hub', component: HubMenu}
};

export default function CifrotechMainApp() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();

    const [currentMenu, setCurrentMenu] = useState(MENU_TYPE.IN_STOCK);
    const [contentDataId, setContentDataId] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const handleCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    const handleMainSwitchBtnClick = () => {
        setCurrentMenu((current) =>
            current === MENU_TYPE.HUB ? MENU_TYPE.IN_STOCK : MENU_TYPE.HUB
        );
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId);
        if (window.innerWidth <= 480) {
            handleMenuButtonClick()
        }
    };

    const handleMenuButtonClick = () => {
        setCollapsed(true);
    };

    const WhiteStyle = {
        backgroundColor: colorBgContainer,
        borderRadius: borderRadiusLG,
    };

    const CurrentMenuComponent = currentMenu.component;

    const contentVisible = !(collapsed === false && windowWidth <= 480);

    const contentProps = {
        contentDataId,
        endpoint: currentMenu.endpoint,
        collapsed
    };
    return (
        <>
            <AppHeader onMainSwitchBtnClick={handleMainSwitchBtnClick} toggleButtonText={currentMenu.text}/>
            <Layout style={WhiteStyle}>
                <AppCarousel/>
                <Layout style={WhiteStyle}>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        collapsed={collapsed}
                        onCollapse={handleCollapse}
                        style={{textAlign: 'left', background: "white"}}
                        trigger={<div className="menu-logo"><LogoIconButtonSVG/><LogoMenuButtonSVG/></div>}
                        width={270}>
                        <CurrentMenuComponent onClick={handleContentCatalogId} endpoint={currentMenu.endpoint}/>
                    </Sider>
                    {contentVisible && (
                        <Content>
                            <Routes>
                                <Route path="/" element={<AppContent contentDataId={contentDataId}/>}/>
                                <Route path="/:endpoint/:id" element={<AppContent {...contentProps} />}/>
                                <Route path="/product/:productId" element={<ProductDetail/>}/>
                                <Route path="/address" element={<Address/>}/>
                            </Routes>
                        </Content>
                    )}
                </Layout>
            </Layout>
            <AppFooter/>
        </>
    );
}
