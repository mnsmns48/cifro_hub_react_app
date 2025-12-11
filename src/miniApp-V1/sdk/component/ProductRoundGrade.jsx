import { useContext, useMemo } from "react";
import { UnorderedListOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import styles from "../css/productroundgrade.module.css";
import { ThemeContext } from "../context.js";

function ProductRoundGrade({ productItems, selectedModel, setSelectedModel }) {
    const theme = useContext(ThemeContext);

    // Уникальные модели
    const modelTabs = useMemo(() => {
        const models = Array.from(
            new Set(
                productItems
                    .map(p => p.model)
                    .filter(Boolean)
            )
        );
        return models.length > 1 ? ["ALL", ...models] : models;
    }, [productItems]);

    const hasNoModelItems = useMemo(() => {
        return productItems.some(p => !p.model);
    }, [productItems]);

    if (modelTabs.length === 0 && !hasNoModelItems) return null;

    const tabs = [...modelTabs];
    if (hasNoModelItems) tabs.push("NO_MODEL");

    return (
        <div className={styles.horizontalScrollContainer}>
            {tabs.map(model => {
                const isSelected = selectedModel === model;
                return (
                    <button
                        key={model}
                        className={`${styles.modelButton} ${isSelected ? styles.selected : ""}`}
                        onClick={() => setSelectedModel(model)}
                    >
                        {model === "ALL" ? (
                            <UnorderedListOutlined style={{ fontSize: 18 }} />
                        ) : model === "NO_MODEL" ? (
                            <QuestionCircleOutlined style={{ fontSize: 18 }} />
                        ) : (
                            model
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default ProductRoundGrade;
