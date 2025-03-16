import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Layout, theme} from 'antd';
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppContent from "./components/AppContent.jsx";
import {useState} from "react";
import InStockMenu from "./components/instock/InStockMenu.jsx";
import HubMenu from "./components/hub/HubMenu.jsx";
import AppCarousel from "./components/Carousel.jsx";
import ProductDetail from "./components/ProductDetail.jsx";

const {Sider, Content} = Layout;

export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken()
    const [toggleButtonText, setToggleButtonText] = useState("ХАБ ДОСТАВКИ");
    const [mainMenu, setMainMenu] = useState(false);
    const [contentDataId, setContentDataId] = useState('');
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
    const [currentMenu, setCurrentMenu] = useState("HUB");

    const handleMainSwitchBtnClick = () => {
        setMainMenu(!mainMenu);
        setToggleButtonText(mainMenu ? "ХАБ ДОСТАВКИ" : "Каталог НАЛИЧИЯ")
        setCurrentMenu(mainMenu ? "HUB" : "IN_STOCK");
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId);
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    }

    return (
        <Router>
            <Layout style={{maxWidth: '1400px', margin: '0 auto', backgroundColor: 'white'}}>
                <AppHeader
                    onMainSwitchBtnClick={handleMainSwitchBtnClick}
                    toggleButtonText={toggleButtonText}
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        backgroundColor: 'white'
                    }}
                />
                <AppCarousel />
                <Layout style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Sider
                        breakpoint="md"
                        collapsedWidth="0"
                        collapsed={collapsed}
                        onCollapse={(collapsed) => setCollapsed(collapsed)}
                        zeroWidthTriggerStyle={{ top: '10px' }}
                        style={{
                            textAlign: 'left',
                            background: '#fff',
                            padding: '15px',
                        }}
                        width={300}
                    >
                        {mainMenu ? <HubMenu/> : <InStockMenu onClick={handleContentCatalogId}/>}
                    </Sider>
                    <Content style={{padding: '20px'}}>
                        <Routes>
                            <Route path="/" element={<AppContent contentDataId={contentDataId}/>} />
                            <Route path="/category/:id" element={<AppContent contentDataId={contentDataId}/>} />
                            <Route path="/product/:productId" element={<ProductDetail />} />
                        </Routes>
                    </Content>
                </Layout>
                <AppFooter style={{ backgroundColor: 'white' }}/>
            </Layout>
        </Router>
    );
}