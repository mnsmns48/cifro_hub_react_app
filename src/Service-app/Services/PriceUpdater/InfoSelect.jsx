import { Select } from "antd";

const InfoSelect = ({ info }) => {
    if (!info) return "Нет данных";

    if (Array.isArray(info)) {
        return (
            <Select style={{ width: "100%" }} placeholder="Выберите вариант">
                {info.map((item, index) => (
                    <Select.Option key={index} value={item.title}>
                        {item.title || "Нет заголовка"}
                    </Select.Option>
                ))}
            </Select>
        );
    }

    if (typeof info === "object") {
        return (
            <Select style={{ width: "100%" }} placeholder="Выберите вариант" defaultValue={info.title}>
                <Select.Option value={info.title}>{info.title || "Нет заголовка"}</Select.Option>
            </Select>
        );
    }

    return String(info);
};

export default InfoSelect;