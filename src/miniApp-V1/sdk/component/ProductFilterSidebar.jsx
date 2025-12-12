import {useContext, useMemo} from "react";
import {Popup, Button} from "antd-mobile";
import {ThemeContext} from "../context.js";
import styles from "../css/productroundgrade.module.css";

export default function ProductFilterSidebar({
                                                 productItems,
                                                 selectedModel,
                                                 setSelectedModel,
                                                 open,
                                                 setOpen
                                             }) {
    const modelList = useMemo(() => {
        return Array.from(
            new Set(productItems.map(p => p.model).filter(Boolean))
        );
    }, [productItems]);

    const hasNoModelItems = useMemo(
        () => productItems.some(p => !p.model),
        [productItems]
    );

    const buttons = ["ALL", ...modelList];
    if (hasNoModelItems) buttons.push("NO_MODEL");

    const handleSelect = model => {
        setSelectedModel(model);
        setOpen(false);
    };

    const theme = useContext(ThemeContext);

    return (
        <Popup
            visible={open}
            onMaskClick={() => setOpen(false)}
            position="right"
            bodyStyle={{height: 0}}
        >
            <div className={styles.popupContainer}>
                <div >
                    {buttons.map(model => (
                        <Button
                            key={model}
                            color={selectedModel === model ? "primary" : "default"}
                            fill={selectedModel === model ? "solid" : "outline"}
                            onClick={() => handleSelect(model)}
                            style={{
                                background: selectedModel === model
                                    ? theme.colorLightGreen
                                    : theme.colorCard,
                                color: selectedModel === model
                                    ? "black"
                                    : theme.colorText,
                            }}
                            className={styles.pickBtn}
                        >
                            {model === "ALL" ? "Все сразу" : model === "NO_MODEL" ? "Без категории" : null}
                            {model !== "ALL" && model !== "NO_MODEL" ? model : ""}
                        </Button>
                    ))}
                </div>
            </div>
        </Popup>

    );
}
