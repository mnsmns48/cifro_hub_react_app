import {Badge, Popover, Tag, Tooltip, Image} from "antd";
import TooltipColorIndicator from "./TooltipColorIndicator.jsx";
import {BarcodeOutlined, FileExcelOutlined} from "@ant-design/icons";

const buildDynamicAttributeColumnsForOrigins = (origins) => {
    const keyMap = new Map();

    origins.forEach(origin => {
        origin.attrs?.forEach(attr => {
            if (!keyMap.has(attr.key.id)) {
                keyMap.set(attr.key.id, {
                    id: attr.key.id,
                    name: attr.key.key,
                    values: new Set()
                });
            }
            keyMap.get(attr.key.id).values.add(attr.alias || attr.value);
        });
    });

    const sortedKeys = Array.from(keyMap.values()).sort((a, b) => a.id - b.id);

    return sortedKeys.map(key => ({
        title: key.name,
        dataIndex: `attr_${key.id}`,
        key: `attr_${key.id}`,
        align: "center",
        ellipsis: true,
        width: "8%",


        filters: Array.from(key.values).map(v => ({
            text: v,
            value: v
        })),

        onFilter: (value, record) => {
            const attr = record.attrs?.find(a => a.key.id === key.id);
            return attr ? (attr.alias || attr.value) === value : false;
        },

        sorter: (a, b) => {
            const av = a.attrs?.find(x => x.key.id === key.id);
            const bv = b.attrs?.find(x => x.key.id === key.id);

            const aval = av ? (av.alias || av.value) : "";
            const bval = bv ? (bv.alias || bv.value) : "";

            return aval.localeCompare(bval, "ru");
        },

        render: (_, record) => {
            const attr = record.attrs?.find(a => a.key.id === key.id);
            if (!attr) return "—";

            const style = TooltipColorIndicator(attr.value);

            return (
                <Tooltip title={attr.value}>
                    <Tag style={{
                        background: style.isBlack ? "#fff" : style.background,
                        color: style.color,
                        borderColor: style.isBlack ? "#000" : style.background,
                        padding: "2px 6px",
                        fontSize: 12,
                        cursor: "default"
                    }}
                    >
                        {attr.alias || attr.value}
                    </Tag>
                </Tooltip>
            );
        }
    }));
};


export const buildApproveOriginsColumns = ({
                                               setOpenedImageModalView,
                                               selectedModel
                                           }) => {

    const dynamicAttributeColumns = selectedModel
        ? buildDynamicAttributeColumnsForOrigins(selectedModel.origins)
        : [];

    return [
        {
            align: "center",
            dataIndex: "preview",
            key: "preview",
            width: "8%",
            ellipsis: true,
            render: (_, record) => {
                const pics = record.pics || [];
                const previewObj = pics.find(p => p.is_preview);
                const previewUrl = previewObj?.url || null;
                const count = pics.length;
                const cell = [40, 38]
                const content = (
                    <div
                        onClick={() =>
                            setOpenedImageModalView({
                                origin: record.origin,
                                title: record.title,
                                images: record.pics || []
                            })
                        }
                        style={{
                            width: cell[0],
                            height: cell[1],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            opacity: previewUrl ? 1 : 0.3,
                            cursor: "pointer"
                        }}
                    >
                        {previewUrl ? (
                            <Image src={previewUrl}
                                   width={cell[0]}
                                   height={cell[1]}
                                   style={{objectFit: "contain"}}
                                   preview={false}
                            />
                        ) : (
                            <FileExcelOutlined style={{fontSize: 28, opacity: 0.6}}/>
                        )}
                    </div>
                );

                return count > 0 ? (
                    <Badge count={count} offset={[-5, 8]} size="small">
                        {content}
                    </Badge>
                ) : content;
            },
        },
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
            width: "38%",
            render: (text, record) => {
                const a = record.analyze || {};

                const tooltipContent = (
                    <table style={{fontSize: 11, lineHeight: "1.9em", borderSpacing: "2px 4px"}}>
                        <tbody>
                        <tr>
                            <td><b>Нормализованная ценность данной конфигурации:</b></td>
                            <td>{a.value?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Цена предложения:</b></td>
                            <td>{a.market_price?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Базовая цена данной конфигурации:</b></td>
                            <td>{a.market_baseline?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Максимально допустимая цена для данной конфигурации:</b></td>
                            <td>{a.market_upper_limit?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Отклонение от базовой цены:</b></td>
                            <td>{a.market_delta?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Медианное отклонение цен.
                                Показывает разброс цен: маленькое значение - рынок стабильный,
                                большое - рынок шумный и непредсказуемый.</b></td>
                            <td>{a.market_mad?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><b>Эффективная допустимая переплата:</b></td>
                            <td>{a.market_effective_tolerance?.toFixed(2)}</td>
                        </tr>

                        <tr>
                            <td><b>Вердикт:</b></td>
                            <td>{a.verdict ? "OK" : "BAD"}</td>
                        </tr>
                        <tr>
                            <td><b>Причина:</b></td>
                            <td>{a.reason}</td>
                        </tr>
                        </tbody>
                    </table>
                );


                return (
                    <Tooltip placement="topLeft" title={tooltipContent}>
                        <span style={{}}>{text}</span>
                    </Tooltip>
                );
            }
        },
        ...dynamicAttributeColumns,
        {
            align: "center",
            title: <BarcodeOutlined style={{color: "#9e9e9e"}}/>,
            dataIndex: "origin",
            key: "origin",
            width: "5%",
            render: (value) => (
                <span style={{color: "#9e9e9e", fontSize: 10}}>
            {value}
        </span>
            )
        },
        {
            title: "Цена",
            align: "center",
            dataIndex: "output_price",
            key: "output_price",
            width: "6%",
            render: (_, record) => {
                const opt = record.input_price;
                const retail = record.output_price;

                return (
                    <Popover
                        placement="top"
                        content={
                            <div style={{fontSize: 13}}>
                                <span style={{fontWeight: 600, color: "#003e67"}}>
                                    {opt?.toLocaleString("ru-RU")} ₽
                                </span>
                            </div>
                        }
                    >
                        <span style={{fontWeight: 600}}>
                            {retail?.toLocaleString("ru-RU")}
                        </span>
                    </Popover>
                );
            },
        }
    ];
};
