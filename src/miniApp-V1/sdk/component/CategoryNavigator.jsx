import {useMemo} from 'react';

import {useCurrentTheme} from "../theme/useTheme.js";
import baseStyles from "../css/base.module.css";
import styles from "../css/categorynavigator.module.css";

export default function CategoryNavigator({data = [], parent, stack, onSelect}) {
    const theme = useCurrentTheme();

    const parentKey = parent?.id != null ? String(parent.id) : null;

    const level1 = useMemo(() => {
        if (!parentKey) return [];
        return data.filter(
            (i) => i.depth === 1 && String(i.parent_id) === parentKey
        );
    }, [data, parentKey]);

    const currentItems = useMemo(() => {
        if (!stack.length) return level1;
        const last = stack[stack.length - 1];
        return data.filter((i) => String(i.parent_id) === String(last.id));
    }, [data, level1, stack]);

    if (!parent) return null;

    return (

        <div className={baseStyles.centeredContainer} style={{paddingTop: 12}}>
            <div className={styles.depthBoxContainer}>
                {currentItems.map(item => (
                    <div
                        key={item.id}
                        className={styles.elementButton}
                        onClick={() => onSelect(item)}
                        style={{
                            justifyContent: item.icon ? "flex-start" : "center",
                            gap: item.icon ? "12px" : 0,
                            boxShadow: `0 0 4px ${theme.colorPrimary}79`,
                            background: theme.colorCard
                        }}
                    >
                        {item.icon && (
                            <div className={styles.elementIcon}>
                                <img
                                    className={styles.elementImg}
                                    src={item.icon}
                                    alt={item.label}
                                />
                            </div>
                        )}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

    );
}
