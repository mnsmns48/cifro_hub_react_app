import {Image, Badge, Popover, Tooltip, Tag} from "antd";
import {BarcodeOutlined, FileExcelOutlined} from "@ant-design/icons";
import Color from "color";
//
//
// const buildDynamicAttributeColumns = (products) => {
//     const keyMap = new Map();
//
//     products.forEach(product => {
//         product.items.forEach(item => {
//             item.attrs?.forEach(attr => {
//                 if (!keyMap.has(attr.key.id)) {
//                     keyMap.set(attr.key.id, {
//                         id: attr.key.id,
//                         name: attr.key.key,
//                         values: new Set()
//                     });
//                 }
//                 keyMap.get(attr.key.id).values.add(attr.alias || attr.value);
//             });
//         });
//     });
//
//     const sortedKeys = Array.from(keyMap.values()).sort(
//         (a, b) => a.id - b.id
//     );
//
//     return sortedKeys.map(key => ({
//         title: key.name,
//         dataIndex: `attr_${key.id}`,
//         key: `attr_${key.id}`,
//         align: "center",
//         ellipsis: true,
//
//         filters: Array.from(key.values).map(v => ({
//             text: v,
//             value: v
//         })),
//
//         onFilter: (value, record) => {
//             const attr = record.attrs?.find(a => a.key.id === key.id);
//             if (!attr) return false;
//             return (attr.alias || attr.value) === value;
//         },
//
//         sorter: (a, b) => {
//             const av = a.attrs?.find(x => x.key.id === key.id);
//             const bv = b.attrs?.find(x => x.key.id === key.id);
//
//             const aval = av ? (av.alias || av.value) : "";
//             const bval = bv ? (bv.alias || bv.value) : "";
//
//             return aval.localeCompare(bval, "ru");
//         },
//
//         render: (_, record) => {
//             const attr = record.attrs?.find(a => a.key.id === key.id);
//             if (!attr) return "—";
//             return attr.alias || attr.value;
//         }
//     }));
// };
//
// export const buildApproveOriginsColumns = ({
//                                                setOpenedImageModalView,
//                                                selectedFeature,
//                                            }) => {
//
//     const dynamicAttributeColumns = selectedFeature
//         ? buildDynamicAttributeColumns([selectedFeature])
//         : [];
//
//     return [
//         {
//             align: "center",
//             title: <BarcodeOutlined/>,
//             dataIndex: "origin",
//             key: "origin",
//             width: 100,
//         },
//         {
//             title: "Фото",
//             align: "center",
//             dataIndex: "preview",
//             key: "preview",
//             width: 80,
//             render: (_, record) => {
//                 const pics = record.pics || [];
//                 const previewObj = pics.find(p => p.is_preview);
//                 const previewUrl = previewObj?.url || null;
//                 const count = pics.length;
//                 const cellSize = 50;
//
//                 const content = (
//                     <div
//                         onClick={() =>
//                             setOpenedImageModalView({
//                                 origin: record.origin,
//                                 title: record.title,
//                                 images: record.pics || []
//                             })
//                         }
//
//                         style={{
//                             width: cellSize,
//                             height: cellSize,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             opacity: previewUrl ? 1 : 0.3,
//                             cursor: "pointer"
//                         }}
//                     >
//                         {previewUrl ? (
//                             <Image
//                                 src={previewUrl}
//                                 width={cellSize}
//                                 height={cellSize}
//                                 style={{objectFit: "contain"}}
//                                 preview={false}
//                             />
//                         ) : (
//                             <FileExcelOutlined style={{fontSize: 28}}/>
//                         )}
//                     </div>
//                 );
//
//                 return count > 0 ? (
//                     <Badge count={count} offset={[-5, 5]} size="small">
//                         {content}
//                     </Badge>
//                 ) : content;
//             },
//         },
//         {
//             title: "Название",
//             dataIndex: "title",
//             key: "title",
//             width: "30%",
//             render: (text, record) => {
//                 const a = record.analyze || {};
//
//                 const tooltipContent = (
//                     <table style={{fontSize: 12}}>
//                         <tbody>
//                         <tr>
//                             <td><b>Ценность (value):</b></td>
//                             <td>{a.value?.toFixed(2)}</td>
//                         </tr>
//                         <tr>
//                             <td><b>Прирост ценности (value_increase):</b></td>
//                             <td>{a.value_increase?.toFixed(2)}</td>
//                         </tr>
//                         <tr>
//                             <td><b>Переплата (price_increase):</b></td>
//                             <td>{a.price_increase?.toFixed(2)}</td>
//                         </tr>
//                         <tr>
//                             <td><b>Допустимая переплата (threshold):</b></td>
//                             <td>{a.threshold?.toFixed(2)}</td>
//                         </tr>
//                         <tr>
//                             <td><b>Цена за единицу ценности (ratio):</b></td>
//                             <td>{a.ratio?.toFixed(2)}</td>
//                         </tr>
//                         <tr>
//                             <td><b>Вердикт (verdict):</b></td>
//                             <td>{a.verdict ? "OK" : "BAD"}</td>
//                         </tr>
//                         </tbody>
//                     </table>
//
//
//                 );
//
//
//                 return (
//                     <Tooltip placement="topLeft" title={tooltipContent}>
//                         <span style={{cursor: "help"}}>{text}</span>
//                     </Tooltip>
//                 );
//             }
//         },
//         {
//             title: "Цена",
//             align: "center",
//             dataIndex: "output_price",
//             key: "output_price",
//             width: 100,
//             render: (_, record) => {
//                 const opt = record.input_price;
//                 const retail = record.output_price;
//
//                 return (
//                     <Popover
//                         placement="top"
//                         content={
//                             <div style={{fontSize: 13}}>
//                                 Опт:{" "}
//                                 <span style={{fontWeight: 600, color: "#003e67"}}>
//                                     {opt?.toLocaleString("ru-RU")} ₽
//                                 </span>
//                             </div>
//                         }
//                     >
//                         <span style={{cursor: "pointer", fontWeight: 600}}>
//                             {retail?.toLocaleString("ru-RU")}
//                         </span>
//                     </Popover>
//                 );
//             },
//         },
//         ...dynamicAttributeColumns,
//     ];
// };


const BASIC_COLORS = [
    "black", "white", "red", "blue", "green", "yellow", "orange", "pink",
    "purple", "violet", "brown", "beige", "gold", "silver", "gray", "grey",
    "teal", "cyan", "aqua", "navy", "azure", "turquoise", "indigo",
    "ultramarine", "cobalt", "sapphire", "royal", "prussian", "denim",
    "peach", "coral", "rose", "salmon", "apricot",
    "olive", "sand", "tan", "khaki", "mocha", "coffee", "bronze",
    "mint", "lavender", "lilac", "cream",
    "chrome", "graphite", "titanium", "platinum", "copper",
    "emerald", "jade", "forest", "sky", "ocean",
    "midnight", "charcoal", "obsidian",
    "ivory", "pearl", "snow"
];


const WHITE_KEYWORDS = ["white", "starlight", "cloud", "polar", "moonlight", "frosted",
    "arctic", "snow", "pearl"];

const BLACK_KEYWORDS = [
    "black", "midnight", "obsidian", "onyx", "carbon", "graphite", "dark"
];

const tagColorForAttr = (value) => {
    if (!value) {
        return {background: "#8f8f8f", color: "#fff", isBlack: false};
    }

    const lower = value.toLowerCase();

    if (WHITE_KEYWORDS.some(w => lower.includes(w))) {
        return {
            background: "#000",
            color: "#000000",
            isBlack: true
        };
    }

    if (BLACK_KEYWORDS.some(w => lower.includes(w))) {
        return {
            background: "#000000",
            color: "#ffffff",
            isBlack: false,
            border: "none"
        };
    }

    let hex = null;

    try {
        hex = Color(value).hex();
    } catch {
        /* ignore */
    }

    if (!hex) {
        for (const base of BASIC_COLORS) {
            if (lower.includes(base)) {
                try {
                    hex = Color(base).hex();
                    break;
                } catch {
                    /* ignore */
                }
            }
        }
    }

    if (!hex) {
        return {
            background: "#5c334a",
            color: "#fff",
            isBlack: false
        };
    }

    const bg = Color(hex);
    const isLight = bg.isLight();

    return {
        background: hex,
        color: isLight ? "#000" : "#fff",
        isBlack: false
    };
};

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

            const style = tagColorForAttr(attr.value);

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
                const cell = [50, 40]
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
                            <FileExcelOutlined style={{fontSize: 28}}/>
                        )}
                    </div>
                );

                return count > 0 ? (
                    <Badge count={count} offset={[-5, 5]} size="small">
                        {content}
                    </Badge>
                ) : content;
            },
        },
        {dataIndex: "title", width: "38%"},
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
