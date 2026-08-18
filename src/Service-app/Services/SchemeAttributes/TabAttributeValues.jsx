import {useEffect, useState} from "react";
import {Input, message, Select, Space, Table} from "antd";
import {fetchDeleteData, fetchGetData, fetchPostData, fetchPutData} from "../Common/api.js";
import {DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined} from "@ant-design/icons";
import styles from "./css/TabAttributeValues.module.css";
import "../../../ServiceApp.css"
import EmptyState from "../../../Ui/Empty.jsx";

const TabAttributeValues = () => {
    const [keys, setKeys] = useState([]);
    const [values, setValues] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);

    const [collapsed, setCollapsed] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newValue, setNewValue] = useState("");
    const [newAlias, setNewAlias] = useState("");

    const [editingRow, setEditingRow] = useState(null);


    useEffect(() => {
        fetchGetData("/service/attributes/get_attr_values").then((res) => {
            setKeys(res.keys);
            setValues(res.values);
        });
    }, []);

    const filtered = selectedKey
        ? values.filter(v => v.attr_key_id === selectedKey)
        : [];

    const saveAttribute = async (record, isNew) => {
        const trimmedValue = record.value.trim();
        if (!trimmedValue) return;

        let payload;
        let result;

        try {
            if (isNew) {
                payload = {
                    key_id: selectedKey,
                    attribute_name: trimmedValue,
                    alias: record.alias.trim()
                };

                result = await fetchPostData("/service/attributes/create_attribute", payload);

                if (result?.status === 409 || result?.errorCode === 409) {
                    message.error("Такое значение уже существует для этого ключа");
                    return;
                }

                if (result) {
                    const newItem = {
                        id: result.id,
                        attr_key_id: selectedKey,
                        value: trimmedValue,
                        alias: record.alias.trim()
                    };
                    setValues(prev => [newItem, ...prev]);
                }

            } else {
                payload = {
                    id: record.id,
                    attribute_name: trimmedValue,
                    alias: record.alias.trim()
                };

                result = await fetchPutData("/service/attributes/update_attribute", payload);

                if (result?.status === 409 || result?.errorCode === 409) {
                    message.error("Такое значение уже существует для этого ключа");
                    return;
                }

                if (result) {
                    setValues(prev =>
                        prev.map(v =>
                            v.id === record.id
                                ? {...v, value: trimmedValue, alias: record.alias.trim()}
                                : v
                        )
                    );
                }
            }

            setEditingRow(null);
            setShowAddForm(false);
            setNewValue("");
            setNewAlias("");

        } catch (e) {

            if (e?.status === 409) {
                message.error("Такое значение уже существует для этого ключа");
                return;
            }

            message.error("Ошибка при сохранении атрибута");
        }
    };

    const deleteValue = async (record) => {
        const result = await fetchDeleteData(`/service/attributes/delete_attribute?value_id=${record.id}`);

        if (result) {
            setValues(prev => prev.filter(v => v.id !== record.id));
        }
    };

    const columns = [
        {
            dataIndex: "value",
            key: "value",
            width: 200,
            render: (_, record) =>
                editingRow?.id === record.id ? (
                    <Input
                        value={editingRow.value}
                        onChange={(e) => setEditingRow({...editingRow, value: e.target.value})}
                        className={styles.input}
                    />
                ) : (
                    record.value
                )
        },
        {
            dataIndex: "alias",
            key: "alias",
            width: 200,
            render: (_, record) =>
                editingRow?.id === record.id ? (
                    <Input
                        value={editingRow.alias}
                        onChange={(e) => setEditingRow({...editingRow, alias: e.target.value})}
                        className={styles.input}
                    />
                ) : (
                    record.alias
                )
        },
        {
            key: "actions",
            width: 40,
            render: (_, record) => (
                <Space size="small">
                    {editingRow?.id === record.id ? (
                        <>
                            <SaveOutlined onClick={() => saveAttribute(editingRow, false)}/>
                            <CloseOutlined onClick={() => setEditingRow(null)}/>
                        </>
                    ) : (
                        <EditOutlined onClick={() => setEditingRow(record)}/>
                    )}
                    {editingRow?.id !== record.id && (
                        <DeleteOutlined onClick={() => deleteValue(record)}/>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>
            <Select
                placeholder="Выберите ключ"
                className={styles.select}
                onChange={setSelectedKey}
                options={keys.map(k => ({label: k.key, value: k.id}))}
            />

            {selectedKey && (
                <>
                    <div className={styles.addBlock}>
                        {!showAddForm ? (
                            <a className={styles.addLink} onClick={() => setShowAddForm(true)}>
                                Добавить атрибут
                            </a>
                        ) : (
                            <div className={styles.addForm}>
                                <Input
                                    placeholder="Значение"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className={styles.input}
                                />
                                <Input
                                    placeholder="Alias"
                                    value={newAlias}
                                    onChange={(e) => setNewAlias(e.target.value)}
                                    className={styles.input}
                                />

                                <Space>
                                    <div className="circle-container">
                                        <SaveOutlined
                                            className="icon-style"
                                            onClick={() =>
                                                saveAttribute(
                                                    {value: newValue, alias: newAlias},
                                                    true
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="circle-container">
                                        <CloseOutlined
                                            className="icon-style"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setNewValue("");
                                                setNewAlias("");
                                            }}
                                        />
                                    </div>
                                </Space>
                            </div>
                        )}
                    </div>

                    <div className={styles.collapseBlock}>
                        <a className={styles.collapseLink} onClick={() => setCollapsed(prev => !prev)}>
                            {collapsed
                                ? `Показать значения (${filtered.length})`
                                : "Скрыть значения"}
                        </a>
                    </div>

                    {!collapsed && (
                        <Table
                            columns={columns}
                            dataSource={filtered}
                            rowKey="id"
                            pagination={false}
                            showHeader={false}
                            className={styles.table}
                            locale={{emptyText: <EmptyState/>}}
                            scroll={{y: 300}}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TabAttributeValues;
