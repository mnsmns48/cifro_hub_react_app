import {useRef, useLayoutEffect, useState} from "react";
import {TabBar} from "antd-mobile";
import {HomeOutlined, TruckOutlined} from "@ant-design/icons";
import styles from "../css/menubar.module.css";

const MiniAppMenuBar = ({insets, theme, onHeightChange}) => {
    const [activeTab, setActiveTab] = useState("cifrohub");
    const safeBottom = insets?.bottom ?? "0px";
    const ref = useRef(null);


    useLayoutEffect(() => {
        if (!ref.current) return;
        const node = ref.current;
        const updateHeight = () => {
            const height = node.offsetHeight || 0;
            onHeightChange?.(height);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, [onHeightChange]);

    return (
        <div
            ref={ref}
            className={styles.miniAppMenuBar}
            style={{
                borderTop: `1px solid ${theme.colorMuted}`,
                paddingBottom: safeBottom,
                backgroundColor: theme.colorBorder,
            }}
        >
            <TabBar activeKey={activeTab} onChange={setActiveTab}>
                <TabBar.Item key="cifrohub" title="Быстро доставим" icon={<TruckOutlined/>} style={{ padding: '0 40px' }}/>
                <TabBar.Item key="cifrotech" title="Наличие" icon={<HomeOutlined/>}style={{ padding: '0 40px' }}/>
            </TabBar>
        </div>
    );
};

export default MiniAppMenuBar;