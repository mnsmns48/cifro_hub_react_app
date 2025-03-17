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

const {Header, Content, Sider} = Layout;

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
            <Layout style={{ 
                minHeight: '100vh',
                backgroundColor: 'white'
            }}>
                {/* Внешний контейнер с фиксированной шириной */}
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    position: 'relative'
                }}>
                    {/* Фиксированный header */}
                    <Header style={{
                        margin: '10px',
                        position: 'fixed',
                        top: 0,
                        width: '100%',
                        maxWidth: '1400px',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        padding: '0 20px',
                        height: '64px',
                    }}>
                        <AppHeader
                            onMainSwitchBtnClick={handleMainSwitchBtnClick}
                            toggleButtonText={currentMenu.text}
                        />
                    </Header>

                    {/* Отступ для контента под фиксированным header */}
                    <div style={{ paddingTop: '64px' }}>
                        <AppCarousel/>
                        <Layout style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG
                        }}>
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
                                    borderRight: 'none'
                                }}
                                width={300}
                            >
                                <CurrentMenuComponent
                                    onClick={handleContentCatalogId}
                                    endpoint={currentMenu.endpoint}
                                />
                            </Sider>
                            <Content style={{
                                padding: '20px'
                            }}>
                                <Routes>
                                    <Route path="/" element={<AppContent contentDataId={contentDataId}/>}/>
                                    <Route path="/:endpoint/:id"
                                           element={<AppContent contentDataId={contentDataId} endpoint={currentMenu.endpoint}/>}/>
                                    {/*<Route path="/product/:productId" element={<ProductDetail />} />*/}
                                </Routes>
                            </Content>
                        </Layout>
                    </div>

                    <AppFooter style={{ backgroundColor: 'white' }}/>
                </div>
            </Layout>
        </Router>
    );
}