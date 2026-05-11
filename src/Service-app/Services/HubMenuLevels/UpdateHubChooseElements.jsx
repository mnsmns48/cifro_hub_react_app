import {useEffect, useState} from "react";
import {Modal, Button, Segmented, Table, Flex, Tooltip, Popconfirm} from "antd";
import {fetchPostData} from "../Common/api.js";
import "./Css/UpdateHubChooseElements.css"
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import ResolveModelTypeDependencies from "../Common/ResolveModelTypeDependencies.jsx";
import {MenuOutlined} from "@ant-design/icons";
import UpdateHubApproveOrigins from "./UpdateHubApproveOrigins.jsx";
import {PriceSyncFlow} from "./PriceSyncFlow.jsx";

const styleFn = (info) => {
    if (info.props.vertical) {
        return {
            root: {
                border: "2px solid #676760",
                padding: 4,
                width: 350,
            },
            icon: {
                color: "#676760",
            },
            item: {
                textAlign: "start",
            },
        };
    }
    return {};
};

const UpdateHubChooseElements = ({priceSyncList, onClose}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [orderedPathIds, setOrderedPathIds] = useState([]);
    const [selectedByPathId, setSelectedByPathId] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);

    const [isApproveOpen, setIsApproveOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);


            const res = await fetchPostData("/service/resolve_models_for_sync", priceSyncList);
            if (Array.isArray(res) && res.length > 0) {
                setData(res);

                const ids = res.map(item => item.path_id);
                setOrderedPathIds(ids);

                const obj = {};
                res.forEach(item => {
                    obj[item.path_id] = {
                        path_id: item.path_id,
                        route: item.route,
                        models: item.models.filter(m => m.in_hub).map(m => m.id)
                    };
                });
                setSelectedByPathId(obj);

                setActiveIndex(0);
            }

            setLoading(false);
        };

        void load();
    }, []);


    const activePathId = orderedPathIds[activeIndex];
    const activeTab = data.find(d => d.path_id === activePathId);
    const selectedRowKeys = selectedByPathId[activePathId]?.models || [];

    const onRowClick = (record) => {
        setSelectedByPathId(prev => {
            const entry = prev[activePathId];
            const next = entry.models.includes(record.id)
                ? entry.models.filter(id => id !== record.id)
                : [...entry.models, record.id];

            return {
                ...prev,
                [activePathId]: {
                    ...entry,
                    models: next
                }
            };
        });
    };


    const handleRowSelectionChange = (keys) => {
        setSelectedByPathId(prev => {
            const entry = prev[activePathId];

            return {
                ...prev,
                [activePathId]: {
                    ...entry,
                    models: keys
                }
            };
        });
    };


    const columns = [
        {
            title: "Цена ОТ",
            align: "center",
            width: 120,
            sorter: (a, b) => {
                const minA = Math.min(...(a.origins || []).map(x => x.output_price));
                const minB = Math.min(...(b.origins || []).map(x => x.output_price));
                return minA - minB;
            },
            render: (_, record) => {
                const list = record.origins || [];
                if (list.length === 0) return "-";

                const minPrice = Math.min(...list.map(item => item.output_price));
                return minPrice.toLocaleString("ru-RU");
            }
        },
        {
            title: "Название",
            dataIndex: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <Tooltip
                    placement="right"
                    style={{
                        maxWidth: 900,
                        padding: 0,
                    }}
                    title={
                        <div style={{maxWidth: 900}}>

                            <div style={{textAlign: "left", marginBottom: 15}}>
                                <ResolveModelTypeDependencies source={record.source} info={record.info}/>
                            </div>
                            {record.origins?.length ? (
                                <div style={{maxWidth: 900}}>
                                    {[...record.origins]
                                        .sort((a, b) => a.output_price - b.output_price)
                                        .map((a, i) => (
                                            <div key={i} style={{marginBottom: 4}}>
                                                <span>{a.title}: </span>
                                                <span style={{color: "#7FFF00", fontWeight: 600}}>
                                            {a.output_price.toLocaleString("ru-RU")} ₽
                                        </span>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div>Нет данных</div>
                            )}
                        </div>
                    }
                >
            <span style={{cursor: "pointer"}}>
                {text}
            </span>
                </Tooltip>
            )
        },
        {
            title: "Тип",
            align: "center",
            render: (_, r) => r.type_.type,
        },
        {
            title: "Бренд",
            align: "center",
            render: (_, r) => r.brand.brand,
        },
    ];

    const ConfirmClose = ({onConfirm, children}) => (
        <Popconfirm title="Уверены, что хотите закрыть?"
                    description="Данные не сохранятся"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={onConfirm}>
            {children}
        </Popconfirm>
    );

    return loading ? (
        <Spinner/>
    ) : (
        <>
            <Modal open={true} onCancel={onClose} footer={null} width={1280} maskClosable={false} closable={false}>
                <PriceSyncFlow step={3}/>
                <ConfirmClose onConfirm={onClose}>
                    <Button style={{marginTop: 20}}>
                        Закрыть
                    </Button>
                </ConfirmClose>

                <Button
                    color="purple"
                    variant="solid"
                    style={{margin: 10}}
                    icon={<MenuOutlined/>}
                    onClick={() => setIsApproveOpen(true)}
                >
                    Выбрать позиции для обновления
                </Button>

                <div style={{paddingTop: 25}}>
                    <Flex gap="small">
                        {orderedPathIds.length > 0 && (
                            <Segmented
                                value={activeIndex}
                                onChange={setActiveIndex}
                                options={data.map((item, index) => {
                                    const route = item.route;
                                    const last = route[route.length - 1];

                                    return {
                                        value: index,
                                        label: route.map((r) => r.label).join(" - "),
                                        icon: last?.icon ? (
                                            <img
                                                src={last.icon}
                                                alt={last.label}
                                                style={{width: 18, height: 18, objectFit: "contain"}}
                                            />
                                        ) : null,
                                    };
                                })}
                                styles={styleFn}
                                vertical
                                size="small"
                            />
                        )}

                        <div style={{flex: 1}}>
                            {activeTab && (
                                <Table
                                    rowKey="id"
                                    dataSource={activeTab.models}
                                    columns={columns}
                                    pagination={false}
                                    size="small"
                                    rowSelection={{
                                        selectedRowKeys,
                                        onChange: handleRowSelectionChange,
                                        preserveSelectedRowKeys: true
                                    }}
                                    rowClassName={(record) =>
                                        selectedRowKeys.includes(record.id) ? "row-selected" : ""
                                    }
                                    onRow={(record) => ({
                                        onClick: () => onRowClick(record)
                                    })}
                                />
                            )}
                        </div>
                    </Flex>
                </div>
            </Modal>
            {isApproveOpen && (
                <UpdateHubApproveOrigins objForUpdate={selectedByPathId}
                                         onCloseParent={() => onClose()}
                                         onCloseApproveOrigins={() => setIsApproveOpen(false)}/>
            )}
        </>
    );
};

export default UpdateHubChooseElements;
