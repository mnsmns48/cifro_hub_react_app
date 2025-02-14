import {Layout, theme} from 'antd';
import AppHeader from "./components/AppHeader.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppSider from "./components/AppSider.jsx";
import AppContent from "./components/AppContent.jsx";


export default function App() {
    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken()
    return (<>
            <Layout>
                <AppHeader/>
                <Layout style={{background: colorBgContainer, borderRadius: borderRadiusLG}}>
                    <AppSider/>
                    <AppContent/>
                </Layout>
                <AppFooter/>
            </Layout>
        </>
    );
};