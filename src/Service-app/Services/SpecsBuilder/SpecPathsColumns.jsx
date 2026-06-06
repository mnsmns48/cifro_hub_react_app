import {Button, Popconfirm, Input, message, Upload} from "antd";
import {
    CloseOutlined,
    EditOutlined,
    RollbackOutlined,
    SaveOutlined
} from "@ant-design/icons";

export const getSpecPathsTableColumns = ({
                                             editingRowId,
                                             onEdit,
                                             onSave,
                                             onCancel,
                                             onDelete,
                                             newRow,
                                             setNewRow,
                                             uploadIcon,
                                             deleteIcon
                                         }) => [
    {
        title: "Переменная",
        dataIndex: "title",
        width: "21%",
        align: "center",
        render: (_, record) => {
            const isEditing = editingRowId === record.id || record.isNew;

            if (!isEditing) return record.title;

            return (
                <Input
                    size="small"
                    value={newRow.title}
                    onChange={e => setNewRow(prev => ({...prev, title: e.target.value}))}
                />
            );
        }
    },
    {
        title: "Категория",
        align: "center",
        width: "26%",
        render: (_, record) => {
            const isEditing = editingRowId === record.id || record.isNew;

            if (!isEditing) return record.path?.[0] ?? "—";

            return (
                <Input
                    size="small"
                    value={newRow.path?.[0] ?? ""}
                    onChange={e =>
                        setNewRow(prev => ({
                            ...prev,
                            path: [e.target.value, prev.path?.[1] ?? ""]
                        }))
                    }
                />
            );
        }
    },
    {
        title: "Параметр",
        align: "center",
        width: "26%",
        render: (_, record) => {
            const isEditing = editingRowId === record.id || record.isNew;

            if (!isEditing) return record.path?.[1] ?? "—";

            return (
                <Input
                    size="small"
                    value={newRow.path?.[1] ?? ""}
                    onChange={e =>
                        setNewRow(prev => ({
                            ...prev,
                            path: [prev.path?.[0] ?? "", e.target.value]
                        }))
                    }
                />
            );
        }
    },
    {
        dataIndex: "icon",
        align: "center",
        width: "15%",
        render: (_, record) => (
            <Upload key={`${record.id}-${record.icon}`} showUploadList={false}
                    customRequest={async (options) => {
                        try {
                            await uploadIcon(record, options.file);
                            options.onSuccess?.("ok");
                        } catch (e) {
                            message.error("Ошибка загрузки", e);
                        }
                    }}>
                <div style={{position: "relative", display: "inline-block", cursor: "pointer"}}>
                    <img src={record.icon} alt="icon" style={{width: 30, height: 30, objectFit: "contain"}}/>
                    <Button size="small" danger type="text"
                            style={{position: "absolute", top: -8, right: -8, padding: 0, minWidth: 16, height: 16}}
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try {
                                    await deleteIcon(record);
                                } catch {
                                    message.error("Ошибка удаления")
                                }
                            }}>×</Button>
                </div>
            </Upload>
        )
    },
    {
        title: "",
        width: "12%",
        align: "center",
        render: (_, record) => {
            const isNew = record.isNew;
            const isEditing = editingRowId === record.id;

            if (isNew || isEditing) {
                return (
                    <div style={{display: "flex", gap: 8}}>
                        <Button
                            size="small"
                            onClick={() => onSave(record)}
                            icon={<SaveOutlined/>}
                        />
                        <Button
                            size="small"
                            onClick={() => onCancel(record)}
                            icon={<RollbackOutlined/>}
                        />
                    </div>
                );
            }

            return (
                <div style={{display: "flex", gap: 8}}>
                    <Button
                        size="small"
                        onClick={() => onEdit(record)}
                        icon={<EditOutlined/>}
                    />

                    <Popconfirm
                        title="Удалить этот spec path?"
                        description="Это действие необратимо"
                        okText="Удалить"
                        cancelText="Отмена"
                        onConfirm={() => onDelete(record)}
                    >
                        <Button
                            size="small"
                            danger
                            icon={<CloseOutlined/>}
                        />
                    </Popconfirm>
                </div>
            );
        }
    }
];
