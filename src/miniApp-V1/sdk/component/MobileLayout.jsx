import {useState} from 'react';
import {TabBar} from 'antd-mobile';
import {HomeOutlined, TruckOutlined} from '@ant-design/icons';
import {useTheme} from '../theme/useTheme.js';

const MobileLayout = () => {
    const [activeTab, setActiveTab] = useState('cifrohub');
    const theme = useTheme();


    return (
        <>
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingLeft: theme.spacingMd,
                    paddingRight: theme.spacingMd,

                    paddingBottom: 16,
                    color: theme.colorText,
                    fontSize: theme.fontSizeLg,
                    fontWeight: theme.fontWeightBold,
                    display: 'flex',
                    justifyContent: 'start',
                    textAlign: 'start',
                }}
            >
                {activeTab === 'cifrohub' && <h1 style={{margin: 0}}>Хаб</h1>}
                {activeTab === 'cifrotech' && <h1 style={{margin: 0}}>Магазин</h1>}
            </div>
            <div
                style={{
                    borderTop: `1px solid ${theme.colorBorder}`,
                    backgroundColor: theme.colorCard,
                    paddingBottom: 100,
                    flex: '0 0 auto',
                }}
            >

                <TabBar activeKey={activeTab} onChange={setActiveTab}>
                    <TabBar.Item key="cifrohub" title="Быстро доставим" icon={<TruckOutlined/>}/>
                    <TabBar.Item key="cifrotech" title="Наличие" icon={<HomeOutlined/>}/>
                </TabBar>
            </div>
        </>
    );
};

export default MobileLayout;