import {useEffect, useState} from "react";
import {Table, Space, Input, Popconfirm} from "antd";
import {EditOutlined, DeleteOutlined, SaveOutlined, WarningOutlined} from "@ant-design/icons";
import {
    fetchGetData,
    fetchPostData,
    fetchPutData,
    fetchDeleteData
} from "./api.js";

const TabKeys = () => {
    const [keys, setKeys] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const loadKeys = () => {
        fetchGetData("/service/attributes/get_attr_keys").then((data) => {
            setKeys(data);
        });
    };

    useEffect(() => {
        loadKeys();
    }, []);


    const addEmptyRow = () => {
        if (keys.some(k => k.id === "new")) return;

        setKeys([...keys, {id: "new", key: ""}]);
        setEditingId("new");
        setEditingValue("");
    };


    const startEdit = (record) => {
        setEditingId(record.id);
        setEditingValue(record.key);
    };

    const saveEdit = async () => {
        if (!editingValue.trim()) {
            return;
        }

        if (editingId === "new") {
            await fetchPostData(
                `/service/attributes/create_attr_key?key=${encodeURIComponent(editingValue)}`
            );
        } else {
            await fetchPutData(
                `/service/attributes/update_attr_key?key_id=${editingId}&new_key=${encodeURIComponent(editingValue)}`
            );
        }

        setEditingId(null);
        setEditingValue("");
        loadKeys();
    };


    const handleDelete = async (record) => {
        await fetchDeleteData(`/service/attributes/delete_attr_key?key_id=${record.id}`);
        loadKeys();
    };

    const columns = [
        {
            dataIndex: "key",
            key: "key",
            render: (_, record) => {
                if (editingId === record.id) {
                    return (
                        <Input
                            autoFocus
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onPressEnter={saveEdit}
                            onBlur={saveEdit}
                        />
                    );
                }
                return record.key;
            }
        },
        {
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    {editingId === record.id ? (
                        <SaveOutlined style={{fontSize: 14, color: "#1677ff"}} onClick={saveEdit}/>
                    ) : (
                        <Popconfirm
                            title={
                                <span>
                                <WarningOutlined style={{fontSize: 20, color: "#ff0000", marginRight: 8}}/>
                                Ключи нельзя изменять
                                </span>}
                            okText="Всё равно изменить"
                            cancelText="Отмена"
                            onConfirm={() => startEdit(record)}>
                            <EditOutlined style={{fontSize: 14, color: "#7e7e7e"}}/>
                        </Popconfirm>

                    )}

                    {record.id !== "new" && editingId !== record.id && (
                        <Popconfirm
                            title={
                                <span>
                                <WarningOutlined style={{fontSize: 20, color: "#ff0000", marginRight: 8}}/>
                                Ключи нельзя удалять
                                </span>}
                            okText="Я осознаю проблему - всё равно удалить"
                            cancelText="Отмена"
                            onConfirm={() => handleDelete(record)}>
                            <DeleteOutlined style={{fontSize: 14, color: "red", cursor: "pointer"}}/>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={keys} rowKey="id" pagination={false} showHeader={false}
                   style={{marginBottom: 16}}/>

            <div style={{textAlign: "start"}}>
                <a style={{fontSize: 16, cursor: "default"}} onClick={addEmptyRow}>Добавить ключ</a>
            </div>
        </div>
    );
};

export default TabKeys;
