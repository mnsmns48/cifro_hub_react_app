import {useEffect, useState} from "react";
import {Segmented, Table, Image, Tag, Popover, Flex, Spin, Button, Modal} from "antd";
import {BarcodeOutlined, CloseOutlined} from "@ant-design/icons";
import {fetchPostData} from "../SchemeAttributes/api.js";


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
    const [loading, setLoading] = useState(true);
    const [dataForUpdate, setDataForUpdate] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const payload = {
                    items: Array.from(objForUpdate.values()).map(entry => ({
                        path_id: entry.path_id, models_ids: entry.models
                    }))
                };

                const resp = await fetchPostData("/service/approve_origins_for_update", payload);

                setDataForUpdate(resp);
                console.log(resp);
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

    if (loading) {
        return (<div style={{padding: 40, textAlign: "center"}}>
            <Spin size="large"/>
        </div>);
    }

    const selectedPath = dataForUpdate.find((p) => p.path.id === selectedPathId);
    const features = selectedPath ? selectedPath.products : [];
    const selectedFeature = features.find((f) => f.id === selectedFeatureId);

    const dynamicAttributeColumns = selectedFeature ? buildDynamicAttributeColumns([selectedFeature]) : [];


    const columns = [{
        align: "center", title: <BarcodeOutlined/>, dataIndex: "origin", key: "origin", width: 80,
    }, {
        title: "Фото",
        align: "center",
        dataIndex: "preview",
        key: "preview",
        width: 80,
        render: (url) => url ? <Image src={url} width={60} height={60} style={{objectFit: "cover"}}/> : null,
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
            title: "Фото галерея", dataIndex: "pics", key: "pics", render: (pics) => pics && pics.length > 0 ? (<Popover
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

    return (<Modal open={true} closable={false} footer={null} width={1650}>
            <div style={{padding: 16}}>

                <Flex gap={16} align="flex-end" style={{marginBottom: 20}}>
                    <div style={{width: 350}}>
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
                            options={Array.from(objForUpdate.values()).map(entry => {
                                const route = entry.route;
                                const last = route[route.length - 1];

                                return {
                                    value: entry.path_id,
                                    label: route.map(r => r.label).join(" - "),
                                    icon: last?.icon ? (<img src={last.icon}
                                                             alt={last.label}
                                                             style={{width: 18, height: 18, objectFit: "contain"}}
                                    />) : null,
                                };
                            })}
                        />
                    </div>
                    <div style={{width: 350}}>
                        {selectedPath && (<Segmented
                            styles={styleFn}
                            vertical
                            size="small"
                            value={selectedFeatureId}
                            onChange={(val) => setSelectedFeatureId(val)}
                            options={features.map((f) => ({
                                label: f.title, value: f.id,
                            }))}
                            style={{width: "100%"}}
                        />)}
                    </div>

                </Flex>
                <div style={{marginTop: 10}}>
                    {selectedFeature && (<Table
                        rowKey="origin"
                        dataSource={selectedFeature.items}
                        columns={columns}
                        pagination={false}
                        size="small"
                    />)}
                </div>

                <div style={{marginTop: 16, textAlign: "right"}}>
                    <Button icon={<CloseOutlined/>} onClick={onCloseApproveOrigins}>
                        Закрыть
                    </Button>
                </div>

            </div>
        </Modal>


    );
};


export default UpdateHubApproveOrigins;
