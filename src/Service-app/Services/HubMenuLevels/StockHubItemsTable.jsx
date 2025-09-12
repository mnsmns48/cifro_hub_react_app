import {useCallback, useEffect, useState} from "react";
import {Table, Spin, Space, Button, Popconfirm} from "antd";
import {deleteStockItems, fetchStockHubItems, renameOrChangePriceStockItem} from "./api.js";
import "./Css/Tree.css";
import {EditOutlined, SaveOutlined, RedoOutlined, FileJpgOutlined, DeleteOutlined} from "@ant-design/icons";
import UploadImagesModal from "../PriceUpdater/UploadImagesModal.jsx";
import InfoSelect from "../PriceUpdater/InfoSelect.jsx";


const StockHubItemsTable = ({pathId, visible = true, onSelectedOrigins}) => {
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
            const payload = {
                origin: editingRowData.origin,
                title: editingRowData.title,
                new_price: editingRowData.output_price
            };
            const response = await renameOrChangePriceStockItem(payload);

            setItems(prev =>
                prev.map(item =>
                    item.origin === response.origin
                        ? {
                            ...item,
                            title: response.new_title,
                            output_price: response.new_price,
                            updated_at: response.updated_at ?? item.updated_at,
                            profit_range_id: response.profit_range_id,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error("Ошибка при сохранении изменений:", error);
        } finally {
            setEditingKey(null);
            setOriginalRecord(null);
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
                    value
                )
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
            <Table
                className="stockHubTable"
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
                isOpen={uploadModalOpen}
                originCode={currentOrigin}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={(data) => handleImageUploaded(data, currentOrigin)}
            />
        </div>

    );
}

export default StockHubItemsTable;
