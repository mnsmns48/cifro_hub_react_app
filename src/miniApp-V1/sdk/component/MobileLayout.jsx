import {useState} from 'react';
import {TabBar} from 'antd-mobile';
import {HomeOutlined, TruckOutlined} from '@ant-design/icons';
import {useTheme} from '../theme/useTheme.js';
import useTelegramEnvironment from '../hook/useTelegramEnvironment.jsx';

const MobileLayout = () => {
    const {viewportHeight, safeTop, safeBottom} = useTelegramEnvironment();
    const [activeTab, setActiveTab] = useState('cifrohub');
    const theme = useTheme();

    const topBarHeight = Math.round(safeTop);
    const bottomPadding = Math.round(safeBottom + 12);



    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: viewportHeight,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.colorBackground,
                paddingTop: safeTop,
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingLeft: theme.spacingMd,
                    paddingRight: theme.spacingMd,
                    paddingTop: topBarHeight,
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
            {topBarHeight}
            <div
                style={{
                    borderTop: `1px solid ${theme.colorBorder}`,
                    backgroundColor: theme.colorCard,
                    paddingBottom: bottomPadding,
                    flex: '0 0 auto',
                }}
            >

                <TabBar activeKey={activeTab} onChange={setActiveTab}>
                    <TabBar.Item key="cifrohub" title="Быстро доставим" icon={<TruckOutlined/>}/>
                    <TabBar.Item key="cifrotech" title="Наличие" icon={<HomeOutlined/>}/>
                </TabBar>
                {}
            </div>
        </div>
    );
};

export default MobileLayout;