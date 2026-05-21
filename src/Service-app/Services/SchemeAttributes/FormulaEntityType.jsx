import {useEffect, useState} from "react";
import {Modal, Table, Button, Tooltip, Input, Space, Popconfirm} from "antd";
import {AppstoreAddOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {fetchDeleteData, fetchGetData, fetchPostData} from "../Common/api.js";

function FormulaEntityType({open, onClose}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        title_type: "",
        description: ""
    });

    const loadData = async () => {
        setLoading(true);
        const res = await fetchGetData("service/formula-expression/fetch_entity_types");
        setData(res || []);
        setLoading(false);
    };

    useEffect(() => {
        if (open) void loadData();
    }, [open]);

    const createType = async () => {
        await fetchPostData("service/formula-expression/add_entity_type", form);
    };

    const updateType = async () => {
        await fetchPostData("service/formula-expression/update_entity_type", {
            id: editing.id,
            ...form
        });
    };

    const handleSave = async () => {
        if (editing?.id) {
            await updateType();
        } else {
            await createType();
        }

        setEditing(null);
        setForm({title_type: "", description: ""});
        void loadData();
    };

    const handleDelete = async (id) => {
        await fetchDeleteData(`service/formula-expression/delete_entity_type/${id}`);
        void loadData();
    };

    const columns = [
        {title: "Тип", dataIndex: "title_type"},
        {title: "Описание", dataIndex: "description", render: v => v || "—"},
        {
            title: "Действия",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Редактировать">
                        <Button
                            size="small"
                            icon={<EditOutlined/>}
                            onClick={() => {
                                setEditing(record);
                                setForm({
                                    title_type: record.title_type,
                                    description: record.description || ""
                                });
                            }}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Удалить? Это действие не рекомендуется! Посыпятся формулы!"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button size="small" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Modal
            title="Типы формул"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div style={{display: "flex", justifyContent: "flex-end", marginBottom: 12}}>
                <Tooltip title="Создать новый тип">
                    <Button
                        size="small"
                        type="primary"
                        icon={<AppstoreAddOutlined/>}
                        onClick={() => {
                            setEditing({id: null});
                            setForm({title_type: "", description: ""});
                        }}
                    />
                </Tooltip>
            </div>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={data}
                columns={columns}
                pagination={false}
            />

            <Modal
                title={editing?.id ? "Редактировать тип" : "Создать тип"}
                open={!!editing}
                onCancel={() => setEditing(null)}
                onOk={handleSave}
            >
                <Input
                    placeholder="Название типа"
                    value={form.title_type}
                    onChange={(e) => setForm({...form, title_type: e.target.value})}
                />

                <Input.TextArea
                    placeholder="Описание"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows={3}
                    style={{marginTop: 12}}
                />
            </Modal>
        </Modal>
    );
}

export default FormulaEntityType;
