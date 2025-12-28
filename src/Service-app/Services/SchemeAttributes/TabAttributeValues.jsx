import {useEffect, useState} from "react";
import {Input, Select, Space, Table} from "antd";
import {fetchDeleteData, fetchGetData, fetchPostData, fetchPutData} from "./api.js";
import {DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import styles from ".//css/TabAttributeValues.module.css"

const TabAttributeValues = () => {
    const [keys, setKeys] = useState([]);
    const [values, setValues] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchGetData("/service/attributes/get_attr_values").then((res) => {
            setKeys(res.keys);
            setValues(res.values);
        });
    }, []);

    const filtered = selectedKey
        ? values.filter(v => v.attr_key_id === selectedKey)
        : [];


    const addEmptyRow = () => {
        if (!selectedKey) return;

        const newRow = {
            id: "new",
            attr_key_id: selectedKey,
            value: "",
            alias: ""
        };

        setValues(prev => [...prev, newRow]);
        setEditingId("new");
    };

    const startEdit = (record) => {
        setEditingId(record.id);
    };

    const saveValue = async (record) => {
        const trimmedValue = record.value.trim();
        if (!trimmedValue) return;

        let payload;
        let result;

        if (record.id === "new") {
            payload = {key: record.attr_key_id, attribute_name: trimmedValue, alias: record.alias};
            result = await fetchPostData("/service/attributes/create_attribute", payload);

        } else {
            payload = {id: record.id, attribute_name: trimmedValue, alias: record.alias};
            result = await fetchPutData("/service/attributes/update_attribute", payload);
        }

        if (result) {
            fetchGetData("/service/attributes/get_attr_values").then((res) => {
                setKeys(res.keys);
                setValues(res.values);
            });
        }

        setEditingId(null);
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
            render: (_, record) =>
                editingId === record.id ? (
                    <Input
                        value={record.value}
                        onChange={(e) => {
                            const val = e.target.value;
                            setValues(prev =>
                                prev.map(v => v.id === record.id ? {...v, value: val} : v)
                            );
                        }}
                        style={{width: "100%"}}
                    />
                ) : (
                    record.value
                )
        },
        {
            dataIndex: "alias",
            key: "alias",
            render: (_, record) => {
                if (editingId === record.id) {
                    return (
                        <Input
                            value={record.alias}
                            onChange={(e) => {
                                const val = e.target.value;
                                setValues(prev =>
                                    prev.map(v => v.id === record.id ? {...v, alias: val} : v)
                                );
                            }}
                        />
                    );
                }
                return record.alias;
            }
        },
        {
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    {editingId === record.id ? (
                        <SaveOutlined
                            style={{fontSize: 14, color: "#1677ff"}}
                            onClick={() => saveValue(record)}
                        />
                    ) : (
                        <EditOutlined
                            style={{fontSize: 14, color: "#7e7e7e"}}
                            onClick={() => startEdit(record)}
                        />
                    )}

                    {record.id !== "new" && editingId !== record.id && (
                        <DeleteOutlined
                            style={{fontSize: 14, color: "red"}}
                            onClick={() => deleteValue(record)}
                        />
                    )}
                </Space>
            ),
        },
    ];


    return (
        <div>
            <Select
                placeholder="Выберите ключ"
                style={{width: 300, marginBottom: 16}}
                onChange={setSelectedKey}
                options={keys.map(k => ({label: k.key, value: k.id}))}
            />

            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                pagination={false}
                showHeader={false}
                className={styles.table}
            />
            {selectedKey && (
                <div style={{textAlign: "start", marginTop: 12}}>
                    <a style={{fontSize: 16, cursor: "pointer"}} onClick={addEmptyRow}>
                        Добавить атрибут
                    </a>
                </div>
            )}

        </div>
    );
};

export default TabAttributeValues;
