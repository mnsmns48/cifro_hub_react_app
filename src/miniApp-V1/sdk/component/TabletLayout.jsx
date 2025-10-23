import { useState } from 'react';
import { TabBar } from 'antd-mobile';
import {
    HomeOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';

const TabletLayout = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div style={{ paddingBottom: '60px' }}>
            {/* Контент по вкладке */}
            <div style={{ padding: '2rem' }}>
                {activeTab === 'home' && <h1>🏠 Главная (Планшет)</h1>}
                {activeTab === 'favorites' && <h1>❤️ Избранное</h1>}
                {activeTab === 'cart' && <h1>🛒 Корзина</h1>}
                {activeTab === 'profile' && <h1>👤 Профиль</h1>}
            </div>


            <TabBar activeKey={activeTab} onChange={setActiveTab}>
                <TabBar.Item key="home" title="Главная" icon={<HomeOutlined />} />
                <TabBar.Item key="favorites" title="Избранное" icon={<HeartOutlined />} />
                <TabBar.Item key="cart" title="Корзина" icon={<ShoppingCartOutlined />} />
                <TabBar.Item key="profile" title="Профиль" icon={<UserOutlined />} />
            </TabBar>
        </div>
    );
};

export default TabletLayout;
