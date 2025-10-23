import { useState } from 'react';
import { TabBar } from 'antd-mobile';
import {
    HomeOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/useTheme.js';
import useTelegramEnvironment from '../hook/useTelegramEnvironment.jsx';
import TelegramDebugPanel from "./TelegramDebugPanel.jsx";

const MobileLayout = () => {
    const { viewportHeight, safeTop, safeBottom } = useTelegramEnvironment();
    const [activeTab, setActiveTab] = useState('home');
    const theme = useTheme();

    const topBarHeight = Math.round(safeTop);
    const bottomPadding = Math.round(safeBottom + 12);

    const showDebugPanel = activeTab === 'favorites'; // ⭐ NEW

    return (
        <div
            style={{
                height: viewportHeight,
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.colorBackground,
                overflow: 'hidden',
                boxSizing: 'border-box',
                position: "relative" // ⭐ NEW
            }}
        >

            {/* Верхняя зона */}
            {!showDebugPanel && ( // ⭐ скрываем, если открыт DebugPanel
                <div
                    style={{
                        height: topBarHeight,
                        width: '100%',
                        backgroundColor: '#000',
                        zIndex: 1000,
                        flex: '0 0 auto',
                    }}
                />
            )}

            {/* Основной контейнер */}
            {!showDebugPanel && ( // ⭐ скрываем, если DebugPanel открыт
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingLeft: theme.spacingMd,
                        paddingRight: theme.spacingMd,
                        paddingTop: 16,
                        paddingBottom: 16,
                        color: theme.colorText,
                        fontSize: theme.fontSizeLg,
                        fontWeight: theme.fontWeightBold,
                        display: 'flex',
                        justifyContent: 'start',
                        textAlign: 'start',
                    }}
                >
                    {activeTab === 'home' && <h1 style={{ margin: 0 }}>Главная</h1>}
                    {activeTab === 'cart' && <h1 style={{ margin: 0 }}>Корзина</h1>}
                    {activeTab === 'purchases' && <h1 style={{ margin: 0 }}>Покупки</h1>}
                    {activeTab === 'profile' && <h1 style={{ margin: 0 }}>Профиль</h1>}
                </div>
            )}

            {/* FOOTER */}
            {!showDebugPanel && ( // ⭐ скрываем TabBar
                <div
                    style={{
                        borderTop: `1px solid ${theme.colorBorder}`,
                        backgroundColor: theme.colorCard,
                        paddingBottom: bottomPadding,
                        flex: '0 0 auto',
                    }}
                >
                    <TabBar activeKey={activeTab} onChange={setActiveTab}>
                        <TabBar.Item key="home" title="Главная" icon={<HomeOutlined />} />
                        <TabBar.Item key="favorites" title="Избранное" icon={<HeartOutlined />} />
                        <TabBar.Item key="purchases" title="Покупки" icon={<ShoppingOutlined />} />
                        <TabBar.Item key="cart" title="Корзина" icon={<ShoppingCartOutlined />} />
                        <TabBar.Item key="profile" title="Профиль" icon={<UserOutlined />} />
                    </TabBar>
                </div>
            )}

            {/* 🧩 FULLSCREEN DEBUG PANEL */}
            {showDebugPanel && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999999,
                        backgroundColor: "#000",
                        paddingTop: topBarHeight,
                        overflowY: "auto",
                    }}
                >
                    <TelegramDebugPanel />
                </div>
            )}
        </div>
    );
};

export default MobileLayout;