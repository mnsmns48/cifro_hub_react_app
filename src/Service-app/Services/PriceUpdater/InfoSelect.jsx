

// const InfoSelect = ({ features_title, record, setRows }) => {
//     if (!features_title || typeof info !== "object" || !features_title.result) {
//         return <span style={{ color: "red", fontWeight: "bold" }}>Нет данных</span>;
//     }
    //
    // const { result } = features_title;
    // const selectedItem = Array.isArray(result)
    //     ? record?.info?.result
    //         ? result.find(item => item.title === record.info.features_title)
    //         : null
    //     : result;
    //
    // const handleChange = async (newValue) => {
    //     const newSelectedItem = Array.isArray(result)
    //         ? result.find(item => item.title === newValue)
    //         : result;
    //     if (!newSelectedItem) {
    //         console.error("Объект не найден!");
    //         return;
    //     }
    //     setRows(prev =>
    //         prev.map(item =>
    //             item.origin === record.origin
    //                 ? { ...item, info: { result: newSelectedItem } }
    //                 : item
    //         )
    //     );
    //     try {
    //         const res = await axios.put(`/service/update_parsing_item/${record.origin}`, {
    //             info: { result: newSelectedItem },
    //         });
    //         if (!res.data.is_ok) {
    //             console.error("Ошибка:", res.data.message);
    //         } else {
    //             console.log("Обновление успешно!");
    //         }
    //     } catch (error) {
    //         console.error("Ошибка запроса:", error);
    //     }
    // };
    //
    //
    // if (Array.isArray(result) && result.length === 1) {
    //     return <div>{result[0]?.title || "Нет заголовка"}</div>;
    // }
    //
    //
    // if (!Array.isArray(result)) {
    //     return <div>{result?.title || "Нет заголовка"}</div>;
    // }

    // return (
        // <Select
        //     style={{ width: "100%" }}
        //     placeholder="Выберите вариант"
        //     // value={selectedItem?.title || undefined}
        //     // onChange={handleChange}
        // >
        //     {result.map((item, index) => (
        //         <Select.Option key={index} value={item.title}>
        //             {item.title || "Нет заголовка"}
        //         </Select.Option>
        //     ))}
        // </Select>
//     );
// };


import axios from "axios";
import {Select, Typography} from "antd";


const { Text } = Typography;
const { Option } = Select;

const InfoSelect = ({ titles, record, setRows }) => {
    // 1. нет данных
    if (!Array.isArray(titles) || titles.length === 0) {
        return (
            <Text type="danger" strong>
                Нет данных
            </Text>
        );
    }

    // 2. текущее выбранное значение
    const selected = record.feature_selected ?? undefined;

    // 3. колбэк изменения
    const onChange = value => {
        setRows(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(r => r.origin === record.origin);
            if (idx !== -1) {
                copy[idx] = { ...copy[idx], feature_selected: value };
            }
            return copy;
        });
    };

    return (
        <Select
            style={{ width: "100%" }}
            value={selected}
            placeholder="Выберите вариант"
            showSearch
            optionFilterProp="children"
            onChange={onChange}
        >
            {titles.map(title => (

                <Option key={title} value={title}>
                    {title}
                </Option>
            ))}
        </Select>
    );
};




export default InfoSelect;
