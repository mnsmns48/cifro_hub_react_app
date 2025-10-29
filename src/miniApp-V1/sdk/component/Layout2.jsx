import {useState} from 'react';
import {TabBar} from 'antd-mobile';
import {HomeOutlined, TruckOutlined} from '@ant-design/icons';
import {useTheme} from '../theme/useTheme.js';
import SearchLine from "./SearchLine.jsx";

const Layout2 = () => {
    const [activeTab, setActiveTab] = useState('cifrohub');
    const theme = useTheme();

    return (
        <div>
            уйх
        </div>

    )

    // return (
    //     <>
    //         {activeTab === 'cifrohub' && <h2 style={{ background: 'lime', margin: 0 }}>Цифрохаб</h2>}
    //         {activeTab === 'cifrotech' && <h2 style={{margin: 0}}>Магазин</h2>}
    //         <SearchLine/>
    //         <div
    //             style={{
    //                 borderTop: `1px solid ${theme.colorBorder}`,
    //                 backgroundColor: '#800101',
    //                 // paddingBottom: 50,
    //                 // flex: '0 0 auto',
    //             }}
    //         >
    //             <TabBar activeKey={activeTab} onChange={setActiveTab}>
    //                 <TabBar.Item key="cifrohub" title="Быстро доставим" icon={<TruckOutlined/>}/>
    //                 <TabBar.Item key="cifrotech" title="Наличие" icon={<HomeOutlined/>}/>
    //             </TabBar>
    //         </div>
    //     </>
    // );
};

export default Layout2;