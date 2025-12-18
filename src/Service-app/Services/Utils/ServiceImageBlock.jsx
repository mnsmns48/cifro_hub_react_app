import {Table, Button, Modal, Input, Space, message, Popconfirm, Typography, Empty, Collapse} from "antd";
import {PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {fetchApiGet, createServiceImage, updateServiceImage, deleteServiceImage} from "./api.js";
import styles from "../Css/serviceimage.module.css"

export function ServiceImageBlock() {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formValue, setFormValue] = useState({var: "", value: ""});
    const [isOpen, setIsOpen] = useState(false);

    async function loadData() {
        try {
            const response = await fetchApiGet("service/get_utils_images");
            setData(response || []);
        } catch (e) {
            console.error("Ошибка при загрузке utils images:", e);
        }
    }

    useEffect(() => {
        if (isOpen) {
            void loadData();
        }
    }, [isOpen]);

    const handleSave = async () => {
        try {
            if (editingItem) {
                const updated = await updateServiceImage(editingItem.id, formValue);
                if (updated) {
                    message.success("Запись обновлена");
                    setModalVisible(false);
                    void loadData();
                }
            } else {
                const created = await createServiceImage(formValue);
                if (created) {
                    message.success("Запись создана");
                    setModalVisible(false);
                    void loadData();
                }
            }
        } catch (e) {
            message.error("Ошибка при сохранении");
        }
    };

    const handleDelete = async (itemId) => {
        const deleted = await deleteServiceImage(itemId);
        if (deleted) void loadData();
    };

    const columns = [
        {dataIndex: "var", key: "var"},
        {
            dataIndex: "image",
            key: "image",
            render: (text, record) => (
                <img
                    src={record.image}
                    alt={record.var}
                    style={{width: 40, height: 40, objectFit: "cover", borderRadius: 4}}
                />
            )
        },
        {dataIndex: "value", key: "value"},
        {
            key: "actions",
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined/>}
                        onClick={() => {
                            setEditingItem(record);
                            setFormValue({var: record.var, value: record.value});
                            setModalVisible(true);
                        }}
                    />
                    <Popconfirm title="Удалить запись?" onConfirm={() => handleDelete(record.id)}
                                okText="Да" cancelText="Нет">
                        <Button icon={<DeleteOutlined/>} danger/>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{display: "inline-block"}}>
            <Collapse onChange={(keys) => setIsOpen(keys.length > 0)}>
                <Collapse.Panel header="Сервисные изображения, Промо-картинки" key="1">


                    <div style={{display: "inline-block"}}>

                        <Typography.Paragraph style={{fontSize: "12px", color: "#999", opacity: 0.9}}>
                            Загружаем в S3 файл, добавляем переменную, а значением будет название файла <br/>
                            При удалении, картинка из s3 не удаляется
                        </Typography.Paragraph>

                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <Table
                                columns={columns}
                                className={styles.tableAutoWidth}
                                showHeader={false}
                                dataSource={data}
                                rowKey="id"
                                pagination={false}
                                style={{width: "auto", marginBottom: 16}}
                                locale={{
                                    emptyText: (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description="Нет данных"
                                        />
                                    )
                                }}
                            />

                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={() => {
                                    setEditingItem(null);
                                    setFormValue({var: "", value: ""});
                                    setModalVisible(true);
                                }}
                            >
                                Добавить запись
                            </Button>
                        </div>
                        <Modal
                            title={editingItem ? "Редактировать запись" : "Добавить запись"}
                            open={modalVisible}
                            onOk={handleSave}
                            onCancel={() => setModalVisible(false)}
                        >
                            <Input
                                placeholder="var"
                                value={formValue.var}
                                onChange={(e) => setFormValue({...formValue, var: e.target.value})}
                                style={{marginBottom: 8}}
                            />
                            <Input
                                placeholder="value"
                                value={formValue.value}
                                onChange={(e) => setFormValue({...formValue, value: e.target.value})}
                            />
                        </Modal>
                    </div>

                </Collapse.Panel>
            </Collapse>
        </div>
    );

}