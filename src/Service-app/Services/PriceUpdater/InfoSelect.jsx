import { Select } from "antd";

const InfoSelect = ({ info }) => {
    if (!info || typeof info !== "object" || !info.result) return "Нет данных";

    const { result } = info;

    if (Array.isArray(result)) {
        return (
            <Select style={{ width: "100%" }} placeholder="Выберите вариант">
                {result.map((item, index) => (
                    <Select.Option key={index} value={item.title}>
                        {item.title || "Нет заголовка"}
                    </Select.Option>
                ))}
            </Select>
        );
    }

    if (typeof result === "object") {
        return (
            <Select style={{ width: "100%" }} placeholder="Выберите вариант" value={result.title}>
                <Select.Option value={result.title}>{result.title || "Нет заголовка"}</Select.Option>
            </Select>
        );
    }

    return "Нет данных";
};

export default InfoSelect;
