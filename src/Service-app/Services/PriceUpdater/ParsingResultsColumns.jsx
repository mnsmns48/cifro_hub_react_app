import {Image, Button} from "antd";
import {PlusOutlined, RightCircleOutlined, UpCircleOutlined} from "@ant-design/icons";
import {updateParsingItem} from "./api.js";
import InfoSelect from "./InfoSelect.jsx";


export const createParsingColumns = ({setRows, showInputPrice, expandedRows, toggleExpand, openUploadModal}) => [
    {
        dataIndex: "preview",
        key: "preview",
        align: "center",
        render: (url, record) => (
            <div style={{ width: 128, height: 71, position: 'relative', overflow: "hidden"}}>
                {url ? (
                    <>
                        <Image width={60} src={url} alt={record.title} style={{ borderRadius: 4 }} />
                        <Button
                            type="text"
                            icon={<UpCircleOutlined style={{ fontSize: 18, color: '#1677ff' }} />}
                            style={{
                                position: 'absolute',
                                bottom: 4,
                                right: 4,
                                padding: 0,
                                background: 'transparent',
                            }}
                            onClick={() => openUploadModal(record.origin)}
                        />
                    </>
                ) : (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        style={{
                            width: 60,
                            height: 60,
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '25%',
                        }}
                        onClick={() => openUploadModal(record.origin)}
                    />
                )}
            </div>
        ),
    },
    {
        title: "Название",
        dataIndex: "title",
        key: "title",
        width: 230,
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
        title: "origin",
        dataIndex: "origin",
        key: "origin",
        align: "center",
        width: 80,
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
        width: 90,
        align: "center",
        render: (value, record) => {
            const input = parseFloat(record.input_price);
            const output = parseFloat(value);
            const diff = !isNaN(input) ? Math.round(output - input) : null;

            return (
                <div>
                    <b style={{fontSize: 16}}>{value}</b>
                    {(showInputPrice || expandedRows === record.origin) && (
                        <div style={{fontSize: 10, color: "gray"}}>
                            {record.input_price}
                            {diff !== null && (
                                <div style={{fontSize: 9, color: diff >= 0 ? "green" : "red"}}>
                                    {diff}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        },
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
