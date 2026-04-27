import {useEffect, useState} from "react";
import {Segmented, Table, Image, Popover, Flex, Spin, Button, Modal, Badge} from "antd";
import {BarcodeOutlined, CloseOutlined, FileExcelOutlined} from "@ant-design/icons";
import {fetchPostData} from "../SchemeAttributes/api.js";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";


const styleFn = (info) => {
    if (info.props.vertical) {
        return {
            root: {
                border: "2px solid #676760", padding: 4, width: 350,
            }, icon: {
                color: "#676760",
            }, item: {
                textAlign: "start",
            },
        };
    }
    return {};
};


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


const UpdateHubApproveOrigins = ({objForUpdate, onCloseParent, onCloseApproveOrigins}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataForUpdate, setDataForUpdate] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);

    useEffect(() => {
        setLoading(true);
        const load = async () => {
            try {
                const payload = {
                    items: Array.from(objForUpdate.values()).map(entry => ({
                        path_id: entry.path_id, models_ids: entry.models
                    }))
                };

                const resp = await fetchPostData("/service/approve_origins_for_update", payload);
                console.log(resp);
                setDataForUpdate(resp);
                if (resp.length > 0) {
                    setSelectedPathId(resp[0].path.id);

                    if (resp[0].products.length > 0) {
                        setSelectedFeatureId(resp[0].products[0].id);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        void load();

    }, [objForUpdate]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const selectedPath = dataForUpdate.find((p) => p.path.id === selectedPathId);
    const features = selectedPath ? selectedPath.products : [];
    const selectedFeature = features.find((f) => f.id === selectedFeatureId);

    const dynamicAttributeColumns = selectedFeature ? buildDynamicAttributeColumns([selectedFeature]) : [];

    const columns = [{
        align: "center", title: <BarcodeOutlined/>, dataIndex: "origin", key: "origin", width: 100,
    }, {
        title: "Фото",
        align: "center",
        dataIndex: "preview",
        key: "preview",
        width: 80,
        render: (_, record) => {
            const url = record.preview;
            const pics = record.pics || [];
            const count = pics.length;

            const content = (
                <div
                    style={{
                        width: 50,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: url ? 1 : 0.6
                    }}
                >
                    {url ? (
                        <Image
                            src={url}
                            width={50}
                            height={50}
                            style={{objectFit: "cover"}}
                            preview={false}
                        />
                    ) : (
                        <FileExcelOutlined style={{fontSize: 28}}/>
                    )}
                </div>
            );

            return count > 0 ? (
                <Badge
                    count={count}
                    offset={[-5, 5]}
                    size="small"
                >
                    {content}
                </Badge>
            ) : (
                content
            );
        }
    }, {
        title: "Название", dataIndex: "title", key: "title", width: "30%",
    }, {
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
        }
    }, ...dynamicAttributeColumns,
        {
            dataIndex: "pics", key: "pics", render: (pics) => pics && pics.length > 0 ? (<Popover
                content={<div style={{display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 300}}>
                    {pics.map((p, idx) => (<Image key={idx} src={p} width={80}/>))}
                </div>}
            >
                <Button size="small">Открыть</Button>
            </Popover>) : null,
        }, {
            title: "В хабе",
            dataIndex: "origin_in_hub",
            key: "origin_in_hub",
            width: 80,
            render: (v) => (v ? "Да" : "Нет"),
        },];


    return (
        <Modal open closable={false} footer={null} width={1650}>
            {loading ? (
                <div>
                    <Spinner/>
                </div>
            ) : (
                <div style={{padding: 16}}>
                    <div style={{marginBottom: 8, textAlign: "left"}}>
                        <Button icon={<CloseOutlined/>} type="primary" onClick={onCloseApproveOrigins}>
                            Закрыть
                        </Button>
                    </div>

                    <Flex gap={16} align="flex-end" style={{marginBottom: 20}}>
                        <Segmented
                            styles={styleFn}
                            vertical
                            size="small"
                            value={selectedPathId}
                            onChange={(val) => {
                                setSelectedPathId(val);
                                const backendPath = dataForUpdate.find(p => p.path.id === val);
                                if (backendPath && backendPath.products.length > 0) {
                                    setSelectedFeatureId(backendPath.products[0].id);
                                }
                            }}
                            options={Array.from(objForUpdate.values()).map(entry => ({
                                value: entry.path_id,
                                label: entry.route.map(r => r.label).join(" - "),
                                icon: entry.route.at(-1)?.icon && (
                                    <img src={entry.route.at(-1).icon} width={18}/>
                                )
                            }))}
                        />

                        <Segmented styles={styleFn}
                                   vertical
                                   size="small"
                                   value={selectedFeatureId}
                                   onChange={setSelectedFeatureId}
                                   options={features.map(f => ({label: f.title, value: f.id}))}/>
                    </Flex>

                    {selectedFeature && (
                        <Table rowKey="origin"
                               dataSource={selectedFeature.items}
                               columns={columns}
                               pagination={false}
                               size="small"
                               rowSelection={rowSelection}/>
                    )}
                </div>
            )}
        </Modal>
    );
}

export default UpdateHubApproveOrigins;