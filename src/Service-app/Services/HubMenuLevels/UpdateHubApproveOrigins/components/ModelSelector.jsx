
import { Segmented } from "antd";

export default function ModelSelector({ models, selectedModelId, onChange }) {
    if (!models || models.length === 0) return null;

    const options = models.map(m => ({
        value: m.id,
        label: m.title
    }));

    return (
        <Segmented
            vertical
            size="small"
            value={selectedModelId}
            onChange={onChange}
            options={options}
            style={{ width: "100%" }}
            block
        />
    );
}
