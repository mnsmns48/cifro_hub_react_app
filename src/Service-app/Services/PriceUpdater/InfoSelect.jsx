import { Select } from "antd";
import axios from "axios";

const InfoSelect = ({ info, record, setRows }) => {
    if (!info || typeof info !== "object" || !info.result) {
        return <span style={{ color: "red", fontWeight: "bold" }}>Нет данных</span>;
    }

    const { result } = info;
    const selectedItem = Array.isArray(result)
        ? record?.info?.result
            ? result.find(item => item.title === record.info.result.title)
            : null
        : result;

    const handleChange = async (newValue) => {
        const newSelectedItem = Array.isArray(result)
            ? result.find(item => item.title === newValue)
            : result;
        if (!newSelectedItem) {
            console.error("Объект не найден!");
            return;
        }
        setRows(prev =>
            prev.map(item =>
                item.origin === record.origin
                    ? { ...item, info: { result: newSelectedItem } }
                    : item
            )
        );
        try {
            const res = await axios.put(`/service/update_parsing_item/${record.origin}`, {
                info: { result: newSelectedItem },
            });
            if (!res.data.is_ok) {
                console.error("Ошибка:", res.data.message);
            } else {
                console.log("Обновление успешно!");
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    };

    // Если result — это массив и в нем только один элемент, рендерим div
    if (Array.isArray(result) && result.length === 1) {
        return <div>{result[0]?.title || "Нет заголовка"}</div>;
    }

    // Если result — не массив, проверяем его наличие
    if (!Array.isArray(result)) {
        return <div>{result?.title || "Нет заголовка"}</div>;
    }

    return (
        <Select
            style={{ width: "100%" }}
            placeholder="Выберите вариант"
            value={selectedItem?.title || undefined}
            onChange={handleChange}
        >
            {result.map((item, index) => (
                <Select.Option key={index} value={item.title}>
                    {item.title || "Нет заголовка"}
                </Select.Option>
            ))}
        </Select>
    );
};

export default InfoSelect;
