import {Layout, theme} from 'antd';
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppContent from "./components/AppContent.jsx";
import {useState} from "react";
import InStockMenu from "./components/instock/InStockMenu.jsx";
import HubMenu from "./components/hub/HubMenu.jsx";

const {Sider, Content} = Layout;

export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken()
    const [toggleButtonText, setToggleButtonText] = useState("ХАБ ДОСТАВКИ");
    const [mainMenu, setMainMenu] = useState(false);
    const [contentDataId, setContentDataId] = useState('');
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);

    const handleMainSwitchBtnClick = () => {
        setMainMenu(!mainMenu);
        setToggleButtonText(mainMenu ? "ХАБ ДОСТАВКИ" : "Каталог НАЛИЧИЯ")
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId);
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    }

    return (<>
            <Layout style={{maxWidth: '1600px', margin: '0 auto'}}>
                <AppHeader 
                    onMainSwitchBtnClick={handleMainSwitchBtnClick}
                    toggleButtonText={toggleButtonText}
                    style={{position: 'sticky', top: 0, zIndex: 1}}
                />
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
                            padding: '15px'
                        }}
                        width={250}
                    >
                        {mainMenu ? <HubMenu/> : <InStockMenu onClick={handleContentCatalogId}/>}
                    </Sider>
                    <Content style={{
                        padding: '20px'
                    }}>
                        <AppContent contentDataId={contentDataId}/>
                    </Content>
                </Layout>
                <AppFooter/>
            </Layout>
        </>
    );
};