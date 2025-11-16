import {useState, useMemo, useEffect, useCallback} from "react";
import Breadcrumb from "./Breadcrumb.jsx";
import {useCurrentTheme} from "../theme/useTheme.js";
import styles from "../css/categorynavigator.module.css";

export default function CategoryNavigator({data = [], parent}) {
    const [stack, setStack] = useState([]);

    const theme = useCurrentTheme();

    useEffect(() => {
        setStack([]);
    }, [parent]);

    const parentKey = parent && parent.id != null ? String(parent.id) : null;

    const level1 = useMemo(() => {
        if (!parentKey) return [];
        return data.filter(
            (i) => i.depth === 1 && String(i.parent_id) === parentKey
        );
    }, [data, parentKey]);

    const currentItems = useMemo(() => {
        if (stack.length === 0) return level1;
        const last = stack[stack.length - 1];
        return data.filter((i) => String(i.parent_id) === String(last.id));
    }, [data, level1, stack]);

    const handleSelect = useCallback((item) => {
        setStack((prev) => [
            ...prev,
            {id: String(item.id), label: item.label}
        ]);
    }, []);

    const handleBreadcrumbSelect = useCallback((index) => {
        if (index === 0) {
            setStack([]);
        } else {
            setStack((prev) => prev.slice(0, index));
        }
    }, []);

    return (
        <div>
            {!parent ? null : (
                <>
                    <div className={styles.centeredContainer}>
                        <Breadcrumb stack={[{label: parent.label}, ...stack]} onSelect={handleBreadcrumbSelect}/>
                    </div>

                    <div className={styles.centeredContainer} style={{paddingTop: 12}}>
                        <div className={styles.depthBoxContainer}>
                            {currentItems.map((item) => (
                                <div className={styles.elementButton}
                                     key={item.id}
                                     onClick={() => handleSelect(item)}
                                     style={{
                                         justifyContent: item.icon
                                             ? "flex-start"
                                             : "center",
                                         gap: item.icon ? "12px" : 0,
                                         boxShadow: `0 0 4px ${theme.colorPrimary}79`,
                                         background: theme.colorCard,
                                     }}>
                                    {item.icon && (
                                        <div className={styles.elementIcon}>
                                            <img className={styles.elementImg}
                                                 src={item.icon}
                                                 alt={item.label}/>
                                        </div>
                                    )}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}