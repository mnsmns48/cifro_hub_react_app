import {Button, Popconfirm, Input} from "antd";
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
                                             setNewRow
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
        ellipsis: true,
        render: (icon) => {
            if (!icon) return null;
            return (
                <img
                    src={icon}
                    alt="icon"
                    style={{width: 30, height: 30, objectFit: "contain"}}
                />
            );
        }
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
