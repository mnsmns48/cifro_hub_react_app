import styles from '../css/menubar.module.css'
import {TabBar} from "antd-mobile";
import {useState} from "react";
import {HomeOutlined, TruckOutlined} from "@ant-design/icons";


const MiniAppMenuBar = ({theme, viewportHeight}) => {
    const [activeTab, setActiveTab] = useState('cifrohub');
    const paddingTop = viewportHeight ? `${viewportHeight * 0.008}px` : '3px';


    return (
        <div className={styles.miniAppMenuBar}
             style={{
                 borderTop: `1px solid ${theme.colorBorder}`,
                 paddingTop: paddingTop,

                 paddingBottom: `env(safe-area-inset-bottom)`,
                 backgroundColor: '#41a618',
             }}
        >
            <TabBar activeKey={activeTab} onChange={setActiveTab}>
                <TabBar.Item key="cifrohub" title="Быстро доставим" icon={<TruckOutlined/>}/>
                <TabBar.Item key="cifrotech" title="Наличие" icon={<HomeOutlined/>}/>
            </TabBar>
        </div>
    );
};

export default MiniAppMenuBar