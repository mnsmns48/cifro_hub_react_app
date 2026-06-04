import {Select, Button} from "antd";
import {CloseOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";

export const getSpecsPathColumns = ({
                                        createData,
                                        newRow,
                                        setNewRow,
                                        editingRowId,
                                        onSave,
                                        onCancel,
                                        onEdit
                                    }) => [
    {
        title: "Тип",
        dataIndex: ["type", "type"],
        width: 150,
        render: (_, record) => {
            const isNew = record.isNew;
            const isEditing = editingRowId === record.id;

            if (isNew || isEditing) {
                return (
                    <Select
                        style={{width: "100%"}}
                        placeholder="Тип"
                        value={newRow.type_id}
                        onChange={(v) => setNewRow(prev => ({...prev, type_id: v}))}
                        options={createData?.types.map(t => ({
                            label: t.type,
                            value: t.id
                        }))}
                    />
                );
            }

            return record.type?.type;
        }
    },
    {
        title: "Источник",
        width: 250,
        dataIndex: "source",
        render: (_, record) => {
            const isNew = record.isNew;
            const isEditing = editingRowId === record.id;

            if (isNew || isEditing) {
                return (
                    <Select
                        style={{width: "100%"}}
                        placeholder="Источник"
                        value={newRow.source}
                        onChange={(v) => setNewRow(prev => ({...prev, source: v}))}
                        options={createData?.sources.map(s => ({
                            label: s,
                            value: s
                        }))}
                    />
                );
            }

            return record.source;
        }
    },
    {
        title: "Формула",
        dataIndex: ["formula", "name"],
        width: 350,
        render: (_, record) => {
            const isNew = record.isNew;
            const isEditing = editingRowId === record.id;

            if (isNew || isEditing) {
                return (
                    <Select
                        style={{width: "100%"}}
                        placeholder="Формула"
                        value={newRow.formula_id}
                        onChange={(v) => setNewRow(prev => ({...prev, formula_id: v}))}
                        options={createData?.formulas.map(f => ({
                            label: f.name,
                            value: f.id
                        }))}
                    />
                );
            }

            return record.formula?.name;
        }
    },
    {
        title: "",
        width: 100,
        render: (_, record) => {
            const isNew = record.isNew;
            const isEditing = editingRowId === record.id;

            if (isNew || isEditing) {
                return (
                    <div style={{display: "flex", gap: 8}}>
                        <Button onClick={() => onSave(record)} icon={<SaveOutlined/>}/>
                        <Button onClick={() => onCancel(record)} icon={<CloseOutlined/>}/>
                    </div>
                );
            }

            return (
                <Button onClick={() => onEdit(record)} icon={<EditOutlined/>}/>
            );
        }
    }
];
