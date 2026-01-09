import {Image, Button} from "antd";
import {InstagramOutlined, LinkOutlined, PercentageOutlined, PlusOutlined} from "@ant-design/icons";
import {updateParsingItem} from "./api.js";
import InfoSelect from "./InfoSelect.jsx";
import "../Css/ParsingResults.css";

export const createParsingColumns = (
    {setRows, showInputPrice, expandedRows, toggleExpand, openUploadModal, openAttributesModal}
) => [
    {
        dataIndex: "preview",
        key: "preview",
        align: "center",
        render: (url, record) => (
            <div className="preview-container">
                {url ? (
                    <Image
                        width={60}
                        height={60}
                        src={url}
                        alt={record.title}
                        style={{objectFit: "cover", borderRadius: 4}}
                        preview={true}
                    />
                ) : (
                    <Button type="dashed" icon={<PlusOutlined/>}
                            className="preview-dashed-button"
                            onClick={() => openUploadModal(record.origin)}/>
                )}

                {url && (
                    <Button
                        type="text"
                        icon={<InstagramOutlined style={{fontSize: 18, color: "#818181"}}/>}
                        className="add-pic-button"
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
                className={record.in_hub ? "highlight-purple" : ""}
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
        )
    },
    {
        key: "attributes",
        dataIndex: "attributes",
        width: 38,
        render: (_, row) => {
            const attributes = row.attributes;

            const hasAttributes =
                attributes &&
                attributes.model_id &&
                Array.isArray(attributes.attr_value_ids) &&
                attributes.attr_value_ids.length > 0;

            return (
                <Button
                    type="text"
                    icon={<LinkOutlined />}
                    style={{
                        color: hasAttributes ? "#52c41a" : "#dcdcdc",
                        fontSize: hasAttributes ? 20 : 14
                    }}
                    onClick={() =>
                        openAttributesModal({
                            origin: row.origin,
                            model_id: attributes?.model_id,
                            title: row.title,
                            features_title: row.features_title,
                        })
                    }
                />
            );
        }

    }
    ,
    {
        key: "details",
        width: 38,
        align: "center",
        render: (_, record) => (
            <Button
                type="text"
                icon={<PercentageOutlined/>}
                style={{fontSize: 9}}

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
        title: "origin",
        dataIndex: "origin",
        key: "origin",
        align: "center",
        width: 80,
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
