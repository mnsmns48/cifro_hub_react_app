import React, {useEffect, useMemo, useState} from "react";
import {Table, Spin, Button, Popconfirm, Tabs, Tooltip} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {consentDataApiLoad, deleteStockItems} from "./api.js";
import getConsentTableColumns from "./ConsentTableColumns.jsx";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    RedoOutlined,
    ShopOutlined,
    TagOutlined
} from "@ant-design/icons";
import "./Css/Consent.css";
import AddFromConsentTableComponent from "./AddFromConsentTableComponent.jsx";

const Consent = ({
                     comparisonObj: {vsl_list, path_ids},
                     isOpen,
                     onClose
                 }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tabsData, setTabsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isRetail, setIsRetail] = useState(false);
    const [showUpdateComponent, setShowUpdateComponent] = useState(false);

    const payload = useMemo(() => ({vsl_list, path_ids}), [
        vsl_list,
        path_ids
    ]);

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
            .then((data) => {
                setTabsData(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Ошибка загрузки данных:", err);
                setTabsData([]);
            })
            .finally(() => setLoading(false));
    }, [isOpen, payload]);

    const handleDeleteItems = async () => {
        if (selectedRowKeys.length === 0) return;

        try {
            await deleteStockItems({origins: selectedRowKeys});
            const updatedTabs = tabsData.map((tab) => ({
                ...tab,
                items: (tab.items || []).filter(
                    (item) => !selectedRowKeys.includes(item.origin)
                )
            }));
            setTabsData(updatedTabs);
            setSelectedRowKeys([]);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const handleUpdateClick = () => {
        setShowUpdateComponent(true);
    };

    const updateButtonLabel =
        selectedRowKeys.length === 0
            ? "Умное обновление цен"
            : `Пересчитать только эти цены (${selectedRowKeys.length})`;

    const updateButtonIcon =
        selectedRowKeys.length === 0
            ? <ExclamationCircleOutlined/>
            : <RedoOutlined/>

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{textAlign: "center", padding: 24}}>
                    <Spin />
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

        const items = tabsData.map((tab) => ({
            key: String(tab.path_id),
            label: tab.label,
            children: (
                <div style={{width: 1250, overflowX: "auto"}}>
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
                            onChange: setSelectedRowKeys
                        }}
                    />
                </div>
            )
        }));

        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "20px"
                    }}
                >
                    <div style={{display: "flex", alignItems: "center", gap: 20}}>
                        <div style={{flex: "0 0 340px"}}>
                            <Button
                                icon={updateButtonIcon} onClick={handleUpdateClick} className="smart-update-button"
                            >{updateButtonLabel}</Button>
                        </div>

                        <div style={{flex: "0 0 180px"}}>
                            <Tooltip
                                title={
                                    isRetail
                                        ? "Показать входящие оптовые цены"
                                        : "Показать цены Хаба"
                                }
                            >
                                <Button type="text"
                                        onClick={() => setIsRetail((prev) => !prev)}
                                        className={`price-mode-button ${
                                            isRetail ? "price-mode-retail" : "price-mode-wholesale"
                                        }`}
                                >
                                    {isRetail ? <ShopOutlined/> : <TagOutlined/>}
                                    {isRetail ? "Розничные цены" : "Оптовые цены"}
                                </Button>
                            </Tooltip>
                        </div>

                        {selectedRowKeys.length > 0 && (
                            <Popconfirm
                                title="Удаляем?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={handleDeleteItems}
                            >
                                <Button danger icon={<DeleteOutlined/>}>
                                    Удалить ({selectedRowKeys.length})
                                </Button>
                            </Popconfirm>
                        )}
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

                <Tabs items={items}/>

                {showUpdateComponent && (
                    <div>
                        <AddFromConsentTableComponent
                            path_ids={tabsData.map(item => item.path_id)}
                            origins={selectedRowKeys}
                            isOpen={showUpdateComponent}
                            onClose={() => setShowUpdateComponent(false)}/>
                    </div>
                )}
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
