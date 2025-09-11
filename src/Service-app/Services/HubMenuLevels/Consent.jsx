import {useEffect, useMemo, useState} from "react";
import {Table, Spin, Button, Popconfirm, Tabs, Tooltip} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {consentDataApiLoad, deleteStockItems} from "./api.js";
import getConsentTableColumns from "./ConsentTableColumns.jsx";
import {DeleteOutlined, ShopOutlined, TagOutlined} from "@ant-design/icons";
import "./Css/Consent.css";

const Consent = ({
                     comparisonObj: {vsl_list, path_ids},
                     isOpen,
                     onClose
                 }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tabsData, setTabsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isRetail, setIsRetail] = useState(false);

    const payload = useMemo(() => ({vsl_list, path_ids}), [vsl_list, path_ids]);

    const columns = useMemo(
        () => getConsentTableColumns(setTabsData, isRetail),
        [setTabsData, isRetail]
    );

    useEffect(() => {
        if (!isOpen) {
            setTabsData([]);
            return;
        }

        setLoading(true);
        consentDataApiLoad(payload)
            .then(data => {
                setTabsData(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Ошибка загрузки данных:", err);
                setTabsData([]);
            })
            .finally(() => setLoading(false));
    }, [isOpen, payload]);


    const handleDeleteItems = async () => {
        if (selectedRowKeys.length === 0) return;

        try {
            await deleteStockItems({origins: selectedRowKeys});
            const updatedTabs = tabsData.map(tab => ({
                ...tab,
                items: (tab.items || []).filter(item => !selectedRowKeys.includes(item.origin))
            }));
            setTabsData(updatedTabs);
            setSelectedRowKeys([]);

        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{textAlign: "center", padding: 24}}>
                    <Spin tip="Загрузка данных..."/>
                </div>
            );
        }

        if (!tabsData.length) {
            return (
                <div style={{textAlign: "center", color: "#999", padding: 24}}>
                    Нет данных для отображения
                </div>
            );
        }

        const items = tabsData.map(tab => ({
            key: String(tab.path_id),
            label: tab.label,
            children: (
                <div style={{width: 1220, overflowX: 'auto'}}>
                    <Table
                        rowKey="origin"
                        dataSource={tab.items || []}
                        columns={columns}
                        pagination={false}
                        size="small"
                        tableLayout="fixed"
                        style={{width: "100%"}}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                        }}
                    />
                </div>
            )
        }));

        return (
            <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
                    <div style={{display: "flex", alignItems: "center", gap: 50}}>
                        <Tooltip title={isRetail ? "Показать входящие оптовые цены" : "Показать цены Хаба"}>
                            <Button
                                type="text"
                                onClick={() => setIsRetail(prev => !prev)}
                                className={`price-mode-button ${isRetail ? "price-mode-retail" : "price-mode-wholesale"}`}
                            >
                                {isRetail ? <ShopOutlined/> : <TagOutlined/>}
                                {isRetail ? "Розничные цены" : "Оптовые цены"}
                            </Button>
                        </Tooltip>
                    </div>

                    <Popconfirm
                        title="Закрыть просмотр результатов?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={onClose}
                    >
                        <Button type="primary">Закрыть</Button>
                    </Popconfirm>

                </div>
                <div style={{display: "flex", justifyContent: "start", alignItems: "left", marginBottom: 12}}>
                    {selectedRowKeys.length > 0 && (
                        <Popconfirm title="Удаляем?" okText="Да" cancelText="Нет" onConfirm={handleDeleteItems}>
                            <Button danger style={{margin: "0 0 10px 10px"}} icon={<DeleteOutlined/>}>
                                Удалить ({selectedRowKeys.length})
                            </Button>
                        </Popconfirm>

                    )}
                </div>
                <Tabs items={items}/>
            </div>
        );
    };


    return (
        <MyModal
            isOpen={isOpen}
            onClose={onClose}
            content={renderContent()}
            footer={null}
            width={1280}
        />
    );
};

export default Consent;
