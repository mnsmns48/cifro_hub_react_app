import {useCallback, useEffect, useState} from "react";
import {Table, Spin, Space, Button} from "antd";
import {fetchStockHubItems, renameOrChangePriceStockItem} from "./api.js";
import "./Css/Tree.css";
import {EditOutlined, DeleteOutlined, SaveOutlined, RedoOutlined, FileJpgOutlined} from "@ant-design/icons";
import UploadImagesModal from "../PriceUpdater/UploadImagesModal.jsx";
import InfoSelect from "../PriceUpdater/InfoSelect.jsx";



const StockHubItemsTable = ({ pathId, visible = true }) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [originalRecord, setOriginalRecord] = useState(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOrigin, setCurrentOrigin] = useState(null);


    const handleImageUploaded = useCallback(
        ({ images, preview }, origin) => {
            setItems(prev =>
                prev.map(r =>
                    r.origin !== origin
                        ? r
                        : { ...r, images, preview }
                )
            );
        },
        [setItems]
    );

    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        fetchStockHubItems(pathId)
            .then(data => setItems(data))
            .finally(() => setLoading(false));
    }, [pathId, visible]);




    const handleFieldChange = (origin, field, value) => {
        setItems(prev =>
            prev.map(item =>
                item.origin === origin ? { ...item, [field]: value } : item
            )
        );
    };

    const handleEdit = (record) => {
        setOriginalRecord({ ...record });
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
                            updated_at: response.updated_at ?? item.updated_at
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

    const openImageModal = useCallback(origin => {
        setCurrentOrigin(origin);
        setUploadModalOpen(true);
    }, []);

    const columns = [
        {
            dataIndex: "origin",
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
                        style={{ width: "100%" }}
                    />
                ) : (
                    text
                )
        },
        {
            dataIndex: "features_title",
            key: "features_title",
            align: "center",
            width: 200,
            render: (_, record) => (
                <InfoSelect titles={record.features_title} record={record} setRows={setItems} origin={record.origin}/>
            ),
        },
        {
            dataIndex: "warranty",
            key: "warranty",
            width: 40
        },
        {
            dataIndex: "output_price",
            key: "output_price",
            width: 80,
            render: (value, record) =>
                editingKey === record.origin ? (
                    <input
                        type="number"
                        value={value}
                        onChange={e => handleFieldChange(record.origin, "output_price", Number(e.target.value))}
                        style={{ width: "100%" }}
                    />
                ) : (
                    value
                )
        },
        {
            dataIndex: "updated_at",
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
            dataIndex: "dt_parsed",
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
            title: "Действия",
            key: "actions",
            width: 30,
            className: "actions-column",
            render: (_, record) => (
                <Space>
                    {editingKey === record.origin ? (
                        <>
                            <Button
                                icon={<SaveOutlined />}
                                type="link"
                                onClick={() => handleSaveEdit()}
                            />
                            <Button
                                icon={<RedoOutlined />}
                                type="text"
                                danger
                                onClick={handleCancelEdit}
                            />
                        </>
                    ) : (
                        <>
                            <Button type="text" icon={<FileJpgOutlined />} onClick={() => openImageModal(record.origin)} />
                            <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}
                            />
                            <Button
                                icon={<DeleteOutlined />}
                                type="text"
                            />
                        </>
                    )}
                </Space>
            )

        }


    ];

    if (!visible) return null;

    return loading ? (
        <div style={{ padding: 12, textAlign: "center", fontSize: 12 }}>
            <Spin size="small" />
        </div>
    ) : (
        <div style={{ margin: "10px 0"}}>
            <Table
                className="stockHubTable"
                dataSource={items}
                columns={columns}
                rowKey="origin"
                pagination={false}
                size="small"
                showHeader={false}
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
