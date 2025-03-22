import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Layout, theme} from 'antd';
import {useState} from "react";
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppContent from "./components/AppContent.jsx";
import InStockMenu from "./components/instock/InStockMenu.jsx";
import HubMenu from "./components/hub/HubMenu.jsx";
import AppCarousel from "./components/AppCarousel.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import LogoIconButtonSVG from "./components/svg_jsx/LogoIconButtonSVG.jsx";
import LogoMenuButtonSVG from "./components/svg_jsx/LogoMenuButtonSVG.jsx";

const {Content, Sider} = Layout;

const MENU_TYPE = {
    IN_STOCK: {text: "Каталог НАЛИЧИЯ", endpoint: 'instock', component: InStockMenu},
    HUB: {text: "ХАБ ДОСТАВКИ", endpoint: 'hub', component: HubMenu}
};

export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();

    const [currentMenu, setCurrentMenu] = useState(MENU_TYPE.IN_STOCK);
    const [contentDataId, setContentDataId] = useState(false);
    const [collapsed, setCollapsed] = useState(false);


    const handleCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const handleMainSwitchBtnClick = () => {
        setCurrentMenu((current) =>
            current === MENU_TYPE.HUB ? MENU_TYPE.IN_STOCK : MENU_TYPE.HUB
        );
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId);
    };

    const WhiteStyle = {
        backgroundColor: colorBgContainer,
        borderRadius: borderRadiusLG,
    };

    const CurrentMenuComponent = currentMenu.component;

    const contentVisible = true

    const contentProps = {
        contentDataId,
        endpoint: currentMenu.endpoint,
        collapsed
    };
    return (
        <Router>
            <AppHeader onMainSwitchBtnClick={handleMainSwitchBtnClick}  toggleButtonText={currentMenu.text}/>
            <Layout style={WhiteStyle}>
                <AppCarousel/>
                <Layout style={WhiteStyle}>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        collapsed={collapsed}
                        onCollapse={handleCollapse}
                        style={{ textAlign: 'left', background: "white" }}
                        trigger={
                            <div className="menu-logo">
                                <LogoIconButtonSVG/> <LogoMenuButtonSVG/>
                            </div>
                        }
                        width={270}>
                        <CurrentMenuComponent onClick={handleContentCatalogId} endpoint={currentMenu.endpoint}/>
                    </Sider>
                    {contentVisible && (
                        <Content>
                            <Routes>
                                <Route path="/" element={<AppContent contentDataId={contentDataId}/>}/>
                                <Route path="/:endpoint/:id" element={<AppContent {...contentProps} />}/>
                                <Route path="/product/:productId" element={<ProductDetail/>}/>
                            </Routes>
                        </Content>
                    )}
                </Layout>
            </Layout>
            <AppFooter/>
        </Router>
    );
}
