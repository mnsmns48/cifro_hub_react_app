import { Segmented } from "antd";

export default function PathSelector({ paths, selectedPathId, onChange }) {
    if (!paths || paths.length === 0) return null;

    const options = paths.map(entry => ({
        value: entry.path_id,
        label: entry.route.map(r => r.label).join(" - "),
        icon: entry.route.at(-1)?.icon ? (
            <img src={entry.route.at(-1).icon} width={18} alt="" />
        ) : null
    }));

    return (
        <Segmented
            vertical
            size="small"
            value={selectedPathId}
            onChange={onChange}
            options={options}
            style={{ width: "100%" }}
            // кастомизация под твой UI
            block
        />
    );
}
