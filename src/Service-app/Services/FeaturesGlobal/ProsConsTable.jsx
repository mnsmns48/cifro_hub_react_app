import {Table, Button, Modal, Input, Popconfirm} from "antd";
import {useState, useEffect} from "react";
import {DiffOutlined} from "@ant-design/icons";
import {fetchPostData} from "../SchemeAttributes/api.js";

const ProsConsTable = ({prosCons, featureId}) => {
    const [data, setData] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    useEffect(() => {
        setData([
            {
                key: "row",
                advantage: prosCons?.advantage || [],
                disadvantage: prosCons?.disadvantage || []
            }
        ]);
    }, [prosCons]);

    const startEdit = (rowKey, type, index, value) => {
        setEditingItem({rowKey, type, index, isNew: false});
        setEditingValue(value);
    };

    const startAdd = (rowKey, type) => {
        setEditingItem({rowKey, type, index: null, isNew: true});
        setEditingValue("");
    };

    const saveEdit = async () => {
        const {type, index, isNew} = editingItem;

        if (isNew) {
            const payload = {
                id: featureId,
                attribute: type,
                value: editingValue
            };

            const res = await fetchPostData("service/features/add_pros_cons_value", payload);

            if (res) {
                setData([
                    {
                        key: "row",
                        advantage: res.updated.advantage,
                        disadvantage: res.updated.disadvantage
                    }
                ]);
            }

            setEditingItem(null);
            return;
        }

        const oldValue = data[0][type][index];

        const payload = {
            id: featureId,
            attribute: type,
            old_value: oldValue,
            new_value: editingValue
        };

        const res = await fetchPostData("service/features/update_pros_cons_value", payload);

        if (res) {
            setData([
                {
                    key: "row",
                    advantage: res.updated.advantage,
                    disadvantage: res.updated.disadvantage
                }
            ]);
        }

        setEditingItem(null);
    };


    const deleteItem = async (rowKey, type, index) => {
        const value = data[0][type][index];

        const payload = {id: featureId, attribute: type, value: value};
        const res = await fetchPostData("service/features/delete_pros_cons_value", payload);

        if (!res) return;

        setData([
            {
                key: "row",
                advantage: res.updated.advantage,
                disadvantage: res.updated.disadvantage
            }
        ]);
    };


    const columns = [
        {
            title: "Преимущества",
            dataIndex: "advantage",
            key: "advantage",
            render: (_, record) => (
                <div>
                    {record.advantage.map((item, i) => (
                        <div
                            key={i}
                            style={{display: "flex", justifyContent: "space-between", cursor: "pointer"}}
                            onClick={() => startEdit(record.key, "advantage", i, item)}
                        >
                            <span>• {item}</span>

                            <Popconfirm
                                title="Удалить?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    void deleteItem(record.key, "advantage", i);
                                }}
                                onCancel={(e) => e.stopPropagation()}
                            >
                                <Button
                                    type="text"
                                    danger
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    ×
                                </Button>
                            </Popconfirm>

                        </div>
                    ))}
                    <DiffOutlined
                        onClick={() => startAdd(record.key, "advantage")}
                        style={{
                            fontSize: 25,
                            color: "#52c41a",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center"
                        }}
                    />
                </div>
            )
        },
        {
            title: "Недостатки",
            dataIndex: "disadvantage",
            key: "disadvantage",
            render: (_, record) => (
                <div>
                    {record.disadvantage.map((item, i) => (
                        <div
                            key={i}
                            style={{display: "flex", justifyContent: "space-between", cursor: "pointer"}}
                            onClick={() => startEdit(record.key, "disadvantage", i, item)}
                        >
                            <span>• {item}</span>

                            <Popconfirm
                                title="Удалить?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    void deleteItem(record.key, "disadvantage", i);
                                }}
                                onCancel={(e) => e.stopPropagation()}
                            >
                                <Button
                                    type="text"
                                    danger
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    ×
                                </Button>
                            </Popconfirm>


                        </div>
                    ))}

                    <DiffOutlined
                        onClick={() => startAdd(record.key, "disadvantage")}
                        style={{
                            fontSize: 25,
                            color: "#ff0026",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    />
                </div>
            )
        }
    ];

    return (
        <>
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                size="small"
                bordered
                tableLayout="fixed"
                rowClassName={() => "top-align-row"}
            />

            <Modal
                open={!!editingItem}
                onCancel={() => setEditingItem(null)}
                onOk={saveEdit}
                title={editingItem?.isNew ? "Добавление" : "Редактирование"}
            >
                <Input.TextArea
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    rows={4}
                />
            </Modal>
        </>
    );
};

export default ProsConsTable;
