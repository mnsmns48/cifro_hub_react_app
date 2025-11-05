import {useRef, useLayoutEffect, useState, useEffect} from "react";
import {TabBar} from "antd-mobile";
import styles from "../css/menubar.module.css";

const MiniAppMenuBar = ({insets, theme, onHeightChange, keyboardOpen = false, onTabChange, menuElements = []}) => {
    const [activeTab, setActiveTab] = useState("cifrohub");
    const safeBottom = insets?.bottom ?? "0px";
    const ref = useRef(null);
    const lastHeightRef = useRef(null);

    const HEIGHT_THRESHOLD = 1;

    useEffect(() => {
        onTabChange?.(activeTab);
    }, [activeTab, onTabChange]);


    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return;

        const notifyIfChanged = (height) => {
            const last = lastHeightRef.current;
            if (typeof last !== "number" || Math.abs(last - height) > HEIGHT_THRESHOLD) {
                lastHeightRef.current = height;
                onHeightChange?.(height);
            }
        };

        notifyIfChanged(node.offsetHeight || 0);

        if (typeof ResizeObserver !== "undefined") {
            const ro = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const h = Math.round(entry.contentRect.height);
                    notifyIfChanged(h);
                }
            });
            ro.observe(node);
            return () => ro.disconnect();
        }

        const winHandler = () => notifyIfChanged(node.offsetHeight || 0);
        window.addEventListener("resize", winHandler);
        return () => window.removeEventListener("resize", winHandler);
    }, [onHeightChange]);

    if (keyboardOpen) {
        return (
            <div ref={ref} className={styles.miniAppMenuBar}
                 style={{
                     position: "absolute",
                     visibility: "hidden",
                     pointerEvents: "none",
                     overflow: "hidden"
                 }}
            />
        );
    }

    return (
        <div ref={ref}
             className={styles.miniAppMenuBar}
             style={{
                 borderTop: `1px solid ${theme.colorCard}`,
                 paddingBottom: safeBottom,
                 backgroundColor: theme.colorBorder,
             }}>
            <TabBar activeKey={activeTab} onChange={setActiveTab}>
                {menuElements.map((it) => (
                    <TabBar.Item key={it.key} title={it.title} icon={it.icon} style={it.style}
                                 className={activeTab === it.key ? styles.activeTab : styles.inactiveTab}/>
                ))}
            </TabBar>
        </div>
    );
};

export default MiniAppMenuBar;
