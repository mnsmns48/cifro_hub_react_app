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
        // На мобильных устройствах автоматически сворачиваем сайдбар после выбора
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    }

    return (<>
            <Layout>
                <AppHeader onMainSwitchBtnClick={handleMainSwitchBtnClick}
                           toggleButtonText={toggleButtonText}/>
                <Layout style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Sider 
                        breakpoint="md"
                        collapsedWidth="0"
                        collapsed={collapsed}
                        onCollapse={(collapsed) => setCollapsed(collapsed)}
                        zeroWidthTriggerStyle={{ top: '10px' }}
                        style={{textAlign: 'left'}}
                        width={250}
                    >
                        {mainMenu ? <HubMenu/> : <InStockMenu onClick={handleContentCatalogId}/>}
                    </Sider>
                    <AppContent contentDataId={contentDataId}/>
                </Layout>
                <AppFooter/>
            </Layout>
        </>
    );
};