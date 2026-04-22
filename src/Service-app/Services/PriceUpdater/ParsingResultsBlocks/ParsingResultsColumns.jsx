import {Image, Button, Tooltip} from "antd";
import {FileUnknownOutlined, LinkOutlined, PercentageOutlined,} from "@ant-design/icons";
import {updateParsingItem} from "../api.js";
import "../../Css/ParsingResults.css";
import ResolveModelTypeDependencies from "../../Common/ResolveModelTypeDependencies.jsx";

export const createParsingColumns = (
    {setRows, showInputPrice, expandedRows, toggleExpand, openAttributesModal, showDependencyColumn}
) => [
    {
        dataIndex: "preview",
        key: "preview",
        width: 60,
        align: "center",
        render: (url, record) => (url ? (
            <Image width={45} height={45} src={url} alt={record.title}
                   style={{objectFit: "contain"}}
                   preview={true}/>
        ) : (<FileUnknownOutlined style={{fontSize: 24, color: "#cfcfcf"}}/>))
    },
    {
        key: "attributes",
        dataIndex: "attributes",
        width: 50,
        align: "center",
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
                    icon={<LinkOutlined/>}
                    style={{
                        color: hasAttributes ? "#52c41a" : "#dcdcdc",
                        fontSize: hasAttributes ? 18 : 14,
                        border: hasAttributes ? "1px solid #52c41a" : "1px solid transparent",
                        borderRadius: 9
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
    },
    {
        title: "Зависимость",
        dataIndex: "features_title",
        key: "features_title",
        hidden: !showDependencyColumn,
        align: "center",
        width: 215,
        render: (text, record) => (
            <div
                style={{

                    opacity: 0.6
                }}
                title={record.features_title}
            >
                {record.features_title}
            </div>
        )
    },
    {
        title: "Название",
        dataIndex: "title",
        key: "title",
        width: 300,
        render: (text, record, index) => {
            const content = (
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
                    <span style={{fontWeight: 500, fontSize: 14}}>{text}</span>
                </div>
            );

            const hasFeatures =
                Array.isArray(record.features_title) &&
                record.features_title.length > 0;

            if (!hasFeatures) {
                return content;
            }


            return (
                <Tooltip
                    placement="right"
                    overlayInnerStyle={{width: "15vw", maxWidth: "15vw", padding: 15}}
                    title={<ResolveModelTypeDependencies origin={record.origin}/>}
                >
                    {content}
                </Tooltip>
            );
        }
    },
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
];
