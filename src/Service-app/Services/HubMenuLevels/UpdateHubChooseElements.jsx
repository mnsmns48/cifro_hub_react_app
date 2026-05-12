import {useEffect, useState} from "react";
import {Modal, Button, Segmented, Table, Flex, Popconfirm} from "antd";
import {fetchPostData} from "../Common/api.js";
import "./Css/UpdateHubChooseElements.css"
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {MenuOutlined} from "@ant-design/icons";
import UpdateHubApproveOrigins from "./UpdateHubApproveOrigins.jsx";
import {PriceSyncFlow} from "./PriceSyncFlow.jsx";
import {buildHubChooseElementsColumns} from "./UpdateHubChooseElementsColumns.jsx";

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

                const obj = {
                    sortOrderPathId: res.map(item => item.path_id)
                };

                res.forEach(item => {
                    obj[item.path_id] = {
                        path_id: item.path_id,
                        route: item.route,
                        models: item.models.filter(m => m.in_hub)
                    };
                });

                setSelectedByPathId(obj);


                setActiveIndex(0);
            }

            setLoading(false);
        };

        void load();
    }, []);

    if (!selectedByPathId.sortOrderPathId) {
        return <Spinner />;
    }
    const activePathId = selectedByPathId.sortOrderPathId[activeIndex];
    const activeTab = data.find(d => d.path_id === activePathId);
    const selectedRowKeys = selectedByPathId[activePathId]?.models.map(m => m.id) || [];


    const onRowClick = (record) => {
        setSelectedByPathId(prev => {
            const entry = prev[activePathId];

            const exists = entry.models.some(m => m.id === record.id);

            const next = exists
                ? entry.models.filter(m => m.id !== record.id)
                : [...entry.models, record];

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

            const next = activeTab.models.filter(m => keys.includes(m.id));

            return {
                ...prev,
                [activePathId]: {
                    ...entry,
                    models: next
                }
            };
        });
    };


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

                <Button color="purple"
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
                                    columns={buildHubChooseElementsColumns()}
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


