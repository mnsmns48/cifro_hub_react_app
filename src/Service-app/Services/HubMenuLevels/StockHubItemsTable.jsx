import {useCallback, useEffect, useState} from "react";
import {Table, Spin, Space, Button, Popconfirm} from "antd";
import {deleteStockItems, fetchStockHubItems, updateStockItem} from "./api.js";
import "./Css/Tree.css";
import {EditOutlined, SaveOutlined, RedoOutlined, FileJpgOutlined, DeleteOutlined} from "@ant-design/icons";
import UploadImagesModal from "../PriceUpdater/UploadImagesModal.jsx";
import InfoSelect from "../PriceUpdater/InfoSelect.jsx";
import OneItemProfileRewardSelector from "../../../Ui/OneItemProfileRewardSelector.jsx";



const StockHubItemsTable = ({pathId, visible = true, onSelectedOrigins, profit_profiles}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [originalRecord, setOriginalRecord] = useState(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOrigin, setCurrentOrigin] = useState(null);


    const handleImageUploaded = useCallback(
        ({images, preview}, origin) => {
            setItems(prev =>
                prev.map(r =>
                    r.origin !== origin
                        ? r
                        : {...r, images, preview}
                )
            );
        },
        [setItems]
    );

    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        fetchStockHubItems(pathId)
            .then(data => {
                setItems(data);
                console.log('data', data);
            })
            .finally(() => setLoading(false));
    }, [pathId, visible]);

    useEffect(() => {
        setSelectedRowKeys([]);
        onSelectedOrigins?.([]);
    }, [pathId]);


    const handleFieldChange = (origin, field, value) => {
        setItems(prev =>
            prev.map(item =>
                item.origin === origin ? {...item, [field]: value} : item
            )
        );
    };

    const handleEdit = (record) => {
        setOriginalRecord({...record});
        setEditingKey(record.origin);
    };


    const handleCancelEdit = () => {
        setItems(prev =>
            prev.map(item =>
                item.origin === originalRecord.origin ? originalRecord : item
            )
        );
        setEditingKey(null);
        setOriginalRecord(null);
    };

    const editingRowData = items.find(item => item.origin === editingKey);


    const handleSaveEdit = async () => {
        try {
            const origin = editingRowData.origin;
            const title = editingRowData.title;
            const newPrice = editingRowData.output_price;

            const original = originalRecord;
            const titleChanged = original.title !== title;
            const priceChanged = original.output_price !== newPrice;

            const payload = {};

            if (titleChanged) {
                payload.title_update = {};
                payload.title_update[origin] = title;
            }

            if (priceChanged) {
                payload.price_update = [{
                    origin: origin,
                    new_price: newPrice
                }];

            }
            const responses = await updateStockItem(payload);

            setItems(prev =>
                prev.map(item => {
                    const updated = responses.find(r => r.origin === item.origin);
                    if (!updated) return item;

                    return {
                        ...item,
                        title: updated.new_title,
                        output_price: updated.new_price,
                        updated_at: updated.updated_at || item.updated_at,
                        profit_range: updated.profit_range || null
                    };
                })
            );
        } catch (error) {
            console.error("Ошибка при сохранении изменений:", error);
        } finally {
            setEditingKey(null);
            setOriginalRecord(null);
        }
    };

    const handleApplyProfile = async (origin, selectedProfitRangeId) => {
        try {
            const payload = {
                price_updates: [{origin: origin, new_price: 0}],
                new_profit_range_id: selectedProfitRangeId
            };

            const responses = await updateStockItem(payload);
            const updated = responses.find(r => r.origin === origin);
            if (!updated) return;

            setItems(prev =>
                prev.map(item =>
                    item.origin === origin
                        ? {
                            ...item,
                            output_price: updated.new_price,
                            updated_at: updated.updated_at || item.updated_at,
                            profit_range: updated.profit_range || null
                        }
                        : item
                )
            );
        } catch (error) {
            console.error("Ошибка при применении профиля:", error);
        }
    };


    const handleDeleteItems = async () => {
        if (selectedRowKeys.length === 0) return;

        try {
            await deleteStockItems({origins: selectedRowKeys});
            setItems(prev => prev.filter(item => !selectedRowKeys.includes(item.origin)));
            setSelectedRowKeys([]);
            onSelectedOrigins?.([]);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const openImageModal = useCallback(origin => {
        setCurrentOrigin(origin);
        setUploadModalOpen(true);
    }, []);

    const columns = [
        {
            dataIndex: "origin",
            title: "Код",
            key: "origin",
            width: 20
        },
        {
            dataIndex: "title",
            key: "title",
            width: 350,
            render: (text, record) =>
                editingKey === record.origin ? (
                    <input
                        value={record.title}
                        onChange={e => handleFieldChange(record.origin, "title", e.target.value)}
                        style={{width: "100%"}}
                    />
                ) : (
                    text
                )
        },
        {
            dataIndex: "features_title",
            title: "Зависимость",
            key: "features_title",
            align: "center",
            width: 200,
            render: (_, record) => (
                <InfoSelect titles={record.features_title} record={record} setRows={setItems} origin={record.origin}/>
            ),
        },
        {
            dataIndex: "warranty",
            title: "Гарантия",
            key: "warranty",
            width: 40
        },
        {
            dataIndex: "output_price",
            title: "Цена",
            key: "output_price",
            width: 80,
            render: (value, record) =>
                editingKey === record.origin ? (
                    <input
                        type="number"
                        value={value}
                        onChange={e => handleFieldChange(record.origin, "output_price", Number(e.target.value))}
                        style={{width: "100%"}}
                    />
                ) : (
                    <div className="table_output_price">{value}</div>
                )
        },
        {
            dataIndex: "profit_range",
            title: "Профиль",
            key: "profit_range",
            width: 100,
            render: (_, record) => <OneItemProfileRewardSelector
                profit_range={record.profit_range}
                profit_profiles={profit_profiles}
                onApplyProfile={(selectedId) => handleApplyProfile(record.origin, selectedId)}
            />

        },
        {
            dataIndex: "dt_parsed",
            title: "Парсинг",
            key: "dt_parsed",
            width: 40,
            render: val =>
                val
                    ? new Date(val).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "-",
        },
        {
            dataIndex: "updated_at",
            title: "Запись обновлена",
            key: "updated_at",
            width: 40,
            render: val =>
                val
                    ? new Date(val).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "-",
        },
        {
            key: "actions",
            width: 30,
            className: "actions-column",
            render: (_, record) => (
                <Space>
                    {editingKey === record.origin ? (
                        <>
                            <Button icon={<SaveOutlined/>} type="link" onClick={() => handleSaveEdit()}/>
                            <Button icon={<RedoOutlined/>} type="text" danger onClick={handleCancelEdit}/>
                        </>
                    ) : (
                        <>
                            <Button icon={<FileJpgOutlined/>} type="text"
                                    onClick={() => openImageModal(record.origin)}/>
                            <Button icon={<EditOutlined/>} type="link" onClick={() => handleEdit(record)}/>
                        </>
                    )}
                </Space>
            )
        }
    ];

    if (!visible) return null;

    return loading ? (
        <div style={{padding: 12, textAlign: "center", fontSize: 12}}>
            <Spin size="small"/>
        </div>
    ) : (
        <div style={{margin: "10px 0"}}>
            {selectedRowKeys.length > 0 && (
                <Popconfirm title="Удаляем?" okText="Да" cancelText="Нет" onConfirm={handleDeleteItems}>
                    <Button danger style={{margin: "0 0 10px 10px"}} icon={<DeleteOutlined/>}>
                        Удалить ({selectedRowKeys.length})
                    </Button>
                </Popconfirm>

            )}
            <Table className="stockHubTable"
                   dataSource={items}
                   columns={columns}
                   rowKey="origin"
                   pagination={false}
                   size="small"
                   rowSelection={{
                       selectedRowKeys,
                       onChange: (keys) => {
                           setSelectedRowKeys(keys);
                           const selectedItems = items.filter(item => keys.includes(item.origin));
                           onSelectedOrigins?.(selectedItems);
                       }
                   }}

            />
            <UploadImagesModal
                isOpen={uploadModalOpen} originCode={currentOrigin}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={(data) => handleImageUploaded(data, currentOrigin)}/>
        </div>

    );
}

export default StockHubItemsTable;
