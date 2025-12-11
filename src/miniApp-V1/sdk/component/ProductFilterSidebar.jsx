import { useMemo } from "react";
import { Popup, Button } from "antd-mobile";
import {QuestionOutlined} from "@ant-design/icons";

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

    return (
        <Popup
            visible={open}
            onMaskClick={() => setOpen(false)}
            position="right"
            bodyStyle={{ height: 0}}
        >
            <div
                style={{
                    marginTop: '35vh',
                    maxHeight: '60vh',
                    background: '#ffffff',
                    borderRadius: '20px 0 0 20px',
                    padding: 10,
                    overflowY: 'auto',
                    justifyContent: 'end',
                    display: 'flex'
                }}
            >
                <div>
                    {buttons.map(model => (
                        <Button
                            key={model}
                            color={selectedModel === model ? "primary" : "default"}
                            fill={selectedModel === model ? "solid" : "outline"}
                            onClick={() => handleSelect(model)}
                            style={{
                                fontSize: "0.85rem",
                                display: "flex",
                                borderRadius: "1.25rem",
                                margin: "0.375rem"
                            }}
                        >
                            {model === "ALL" ? "Все сразу" : model === "NO_MODEL" ? (
                                <QuestionOutlined />
                            ) : null}
                            {model !== "ALL" && model !== "NO_MODEL" ? model : ""}
                        </Button>
                    ))}
                </div>
            </div>
        </Popup>

    );
}
