import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Layout, theme} from 'antd';
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppContent from "./components/AppContent.jsx";
import {useState} from "react";
import InStockMenu from "./components/instock/InStockMenu.jsx";
import HubMenu from "./components/hub/HubMenu.jsx";
import AppCarousel from "./components/AppCarousel.jsx";
import ProductDetail from "./components/ProductDetail.jsx";

const {Sider, Content} = Layout;

const MENU_TYPE = {
    IN_STOCK: {
        text: "Каталог НАЛИЧИЯ",
        endpoint: 'instock',
        component: InStockMenu,
    },
    HUB: {
        text: "ХАБ ДОСТАВКИ",
        endpoint: 'hub',
        component: HubMenu
    }
};

export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken()
    const [currentMenu, setCurrentMenu] = useState(MENU_TYPE.IN_STOCK);
    const [contentDataId, setContentDataId] = useState('');
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);

    const handleMainSwitchBtnClick = () => {
        setCurrentMenu(current =>
            current === MENU_TYPE.HUB ? MENU_TYPE.IN_STOCK : MENU_TYPE.HUB
        );
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId);
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    }

    const CurrentMenuComponent = currentMenu.component;

    return (
        <Router>
            <Layout style={{maxWidth: '1400px', margin: '0 auto', backgroundColor: 'white'}}>
                <AppHeader
                    onMainSwitchBtnClick={handleMainSwitchBtnClick}
                    toggleButtonText={currentMenu.text}
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        backgroundColor: 'white'
                    }}
                />
                <AppCarousel/>
                <Layout style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Sider
                        breakpoint="md"
                        collapsedWidth="0"
                        collapsed={collapsed}
                        onCollapse={(collapsed) => setCollapsed(collapsed)}
                        zeroWidthTriggerStyle={{top: '10px'}}
                        style={{
                            textAlign: 'left',
                            background: '#fff',
                            padding: '15px',
                        }}
                        width={300}
                    >
                        <CurrentMenuComponent 
                            onClick={handleContentCatalogId}
                            endpoint={currentMenu.endpoint}
                        />
                    </Sider>
                    <Content>
                        <Routes>
                            <Route path="/" element={<AppContent contentDataId={contentDataId}/>}/>
                            <Route path="/:endpoint/:id"
                                   element={<AppContent contentDataId={contentDataId} endpoint={currentMenu.endpoint}/>}/>
                            {/*<Route path="/product/:productId" element={<ProductDetail />} />*/}
                        </Routes>
                    </Content>
                </Layout>
                <AppFooter style={{backgroundColor: 'white'}}/>
            </Layout>
        </Router>
    );
}