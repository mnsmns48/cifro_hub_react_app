import {useState, useMemo, useEffect, useCallback} from "react";
import BreadcrumbTabs from "./BreadcrumbTabs";
import {useCurrentTheme} from "../theme/useTheme.js";

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

    // текущие элементы
    const currentItems = useMemo(() => {
        if (stack.length === 0) return level1;

        const last = stack[stack.length - 1];
        return data.filter((i) => String(i.parent_id) === String(last.id));
    }, [data, level1, stack]);

    // клик по элементу (добавление в стек)
    const handleSelect = useCallback((item) => {
        setStack((prev) => [
            ...prev,
            {id: String(item.id), label: item.label}
        ]);
    }, []);

    // клик по Breadcrumb
    const handleBreadcrumbSelect = useCallback((index) => {
        if (index === 0) {
            setStack([]); // назад к parentId
        } else {
            setStack((prev) => prev.slice(0, index));
        }
    }, []);

    return (
        <div>
            {!parent ? null : (
                <>
                    <div style={{textAlign: "center", display: "flex", justifyContent: "center"}}>
                        <BreadcrumbTabs
                            stack={[{label: parent.label}, ...stack]}
                            onSelect={handleBreadcrumbSelect}
                        />
                    </div>

                    <div
                        style={{
                            paddingTop: 10,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
                                gap: 12,
                                width: "98%",
                                boxSizing: "border-box",
                            }}
                        >
                            {currentItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    style={{
                                        width: '130px',
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",

                                        justifyContent: item.icon
                                            ? "flex-start"
                                            : "center",

                                        gap: item.icon ? "12px" : 0,
                                        boxShadow: `0 0 4px ${theme.colorPrimary}79`,
                                        fontSize: 17,
                                        background: "#f2f2f2",
                                        borderRadius: 20,
                                    }}
                                >
                                    {item.icon && (
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 6,
                                                overflow: "hidden",
                                                background: "transparent",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.label}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />
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
