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
    const [contentDataId, setContentDataId] = useState('')
    const handleMainSwitchBtnClick = () => {
        setMainMenu(!mainMenu);
        setToggleButtonText(mainMenu ? "ХАБ ДОСТАВКИ" : "Каталог НАЛИЧИЯ")
    };

    const handleContentCatalogId = (contentDataId) => {
        setContentDataId(contentDataId)
    }

    return (<>
            <Layout>
                <AppHeader onMainSwitchBtnClick={handleMainSwitchBtnClick}
                           toggleButtonText={toggleButtonText}/>
                <Layout style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <Sider style={{textAlign: 'left'}}>
                        {mainMenu ? <HubMenu/> : <InStockMenu onClick={handleContentCatalogId}/>}
                    </Sider>
                    <AppContent contentDataId={contentDataId}/>
                </Layout>
                <AppFooter/>
            </Layout>
        </>
    );
};