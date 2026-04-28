import {Image, Badge, Button, Popover} from "antd";
import {BarcodeOutlined, FileExcelOutlined} from "@ant-design/icons";


const buildDynamicAttributeColumns = (products) => {
    const keyMap = new Map();

    products.forEach(product => {
        product.items.forEach(item => {
            item.attrs?.forEach(attr => {
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
    });

    const sortedKeys = Array.from(keyMap.values()).sort(
        (a, b) => a.id - b.id
    );

    return sortedKeys.map(key => ({
        title: key.name,
        dataIndex: `attr_${key.id}`,
        key: `attr_${key.id}`,
        align: "center",
        ellipsis: true,

        filters: Array.from(key.values).map(v => ({
            text: v,
            value: v
        })),

        onFilter: (value, record) => {
            const attr = record.attrs?.find(a => a.key.id === key.id);
            if (!attr) return false;
            return (attr.alias || attr.value) === value;
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
            return attr.alias || attr.value;
        }
    }));
};

export const buildApproveOriginsColumns = ({
                                               setOpenedImageModalView,
                                               selectedFeature,
                                           }) => {

    const dynamicAttributeColumns = selectedFeature
        ? buildDynamicAttributeColumns([selectedFeature])
        : [];

    return [
        {
            align: "center",
            title: <BarcodeOutlined/>,
            dataIndex: "origin",
            key: "origin",
            width: 100,
        },
        {
            title: "Фото",
            align: "center",
            dataIndex: "preview",
            key: "preview",
            width: 80,
            render: (_, record) => {
                const pics = record.pics || [];
                const previewObj = pics.find(p => p.is_preview);
                const previewUrl = previewObj?.url || null;
                const count = pics.length;
                const cellSize = 50;

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
                            width: cellSize,
                            height: cellSize,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: previewUrl ? 1 : 0.3,
                            cursor: "pointer"
                        }}
                    >
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                width={cellSize}
                                height={cellSize}
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
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
            width: "30%",
        },
        {
            title: "Цена",
            align: "center",
            dataIndex: "output_price",
            key: "output_price",
            width: 100,
            render: (_, record) => {
                const opt = record.input_price;
                const retail = record.output_price;

                return (
                    <Popover
                        placement="top"
                        content={
                            <div style={{fontSize: 13}}>
                                Опт:{" "}
                                <span style={{fontWeight: 600, color: "#003e67"}}>
                                    {opt?.toLocaleString("ru-RU")} ₽
                                </span>
                            </div>
                        }
                    >
                        <span style={{cursor: "pointer", fontWeight: 600}}>
                            {retail?.toLocaleString("ru-RU")}
                        </span>
                    </Popover>
                );
            },
        },
        ...dynamicAttributeColumns,
        {
            title: "В хабе",
            dataIndex: "origin_in_hub",
            key: "origin_in_hub",
            width: 80,
            render: (v) => (v ? "Да" : "Нет"),
        },
    ];
};
