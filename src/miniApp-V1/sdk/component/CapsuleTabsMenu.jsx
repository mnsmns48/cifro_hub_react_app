import { CapsuleTabs } from "antd-mobile";
import styles from "../css/capsuletab.module.css";
import { useCurrentTheme } from "../theme/useTheme.js";
import { useState, useCallback } from "react";

export default function CapsuleTabsMenu({ data = [], onTabChange }) {
    const theme = useCurrentTheme();
    const [activeKey, setActiveKey] = useState('');

    const toggleTab = useCallback(
        (key) => {
            const isSame = activeKey === key;
            const next = isSame ? null : {
                id: key,
                label: data.find(x => String(x.id) === key)?.label
            };

            setActiveKey(isSame ? '' : key);
            onTabChange?.(next);
        },
        [activeKey, onTabChange, data]
    );


    const handleClick = useCallback(
        (e, key) => {
            e.stopPropagation();
            toggleTab(key);
        },
        [toggleTab]
    );

    const handleKey = useCallback(
        (e, key) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTab(key);
            }
        },
        [toggleTab]
    );

    const renderTitle = (itemId, icon, label) => (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={activeKey === itemId}
            onClick={(e) => handleClick(e, itemId)}
            onKeyDown={(e) => handleKey(e, itemId)}
            style={{ textAlign: "center", cursor: "pointer" }}
        >
            <img
                src={icon}
                alt={label}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    objectFit: "cover",
                }}
            />
            <div>{label}</div>
        </div>
    );

    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <div
            className={styles.capsuleTabMenu}
            data-none-selected={activeKey === '' ? "true" : "false"}
            style={{ "--capsule-active-bg": theme.colorMuted }}
        >
            <CapsuleTabs activeKey={activeKey}>
                {data.map((item) => {
                    const id = String(item.id);

                    return (
                        <CapsuleTabs.Tab
                            key={id}
                            title={renderTitle(id, item.icon, item.label)}
                        >
                        </CapsuleTabs.Tab>
                    );
                })}
            </CapsuleTabs>
        </div>
    );
}
