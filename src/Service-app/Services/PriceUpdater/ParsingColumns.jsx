import {Image, Button} from "antd";
import {RightCircleOutlined} from "@ant-design/icons";
import {updateParsingItem} from "./api.js";
import InfoSelect from "./InfoSelect.jsx";

export const createParsingColumns = ({setRows, showInputPrice, expandedRows, toggleExpand}) => [
    {
        title: "Изображение",
        dataIndex: "preview",
        key: "preview",
        align: "center",
        render: (src, record) => (
            <Image width={60} src={src || "/10000.png"} alt={record.title}/>
        ),
    },
    {
        title: "Название",
        dataIndex: "title",
        key: "title",
        width: 220,
        render: (text, record, index) => (
            <div
                contentEditable
                suppressContentEditableWarning
                style={{cursor: "text"}}
                onBlur={async e => {
                    const newVal = e.target.innerText.trim();
                    if (!newVal || newVal === text) return;

                    setRows(prev => {
                        const copy = [...prev];
                        copy[index] = {...copy[index], title: newVal};
                        return copy;
                    });

                    const res = await updateParsingItem(record.origin, {title: newVal});
                    if (!res.is_ok) console.error("Ошибка:", res.message);
                }}
            >
                {text}
            </div>
        ),
    },
    {
        dataIndex: "input_price",
        key: "input_price",
        width: 100,
        align: "center",
        render: (val, record) =>
            showInputPrice || expandedRows === record.origin ? (
                <span style={{color: "grey"}}>{val}</span>
            ) : (
                ""
            ),
    },
    {
        key: "details",
        width: 40,
        align: "center",
        render: (_, record) => (
            <Button
                type="text"
                icon={<RightCircleOutlined/>}
                onClick={() => toggleExpand(record.origin)}
            />
        ),
    },
    {
        title: "Цена",
        dataIndex: "output_price",
        key: "output_price",
        sorter: (a, b) => parseFloat(a.output_price) - parseFloat(b.output_price),
        sortOrder: "ascend",
        width: 120,
        align: "center",
        render: v => <b style={{fontSize: 16}}>{v}</b>,
    },
    {
        title: "Гарантия",
        dataIndex: "warranty",
        key: "warranty",
        align: "center",
        width: 70,
    },
    {title: "Доставка", dataIndex: "shipment", key: "shipment", align: "center"},
    {title: "Дополнительно", dataIndex: "optional", key: "optional"},
    {
        title: "Зависимость",
        dataIndex: "features_title",
        key: "features_title",
        align: "center",
        width: 215,
        render: (_, record) => (
            <InfoSelect titles={record.features_title} record={record} setRows={setRows} origin={record.origin}/>
        ),
    }
];
