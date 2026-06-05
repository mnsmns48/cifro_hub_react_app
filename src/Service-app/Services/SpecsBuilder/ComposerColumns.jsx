import {Select, Button} from "antd";
import {CloseOutlined, EditOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";

export const getComposerColumns = ({
                                       createData,
                                       newRow,
                                       setNewRow,
                                       editingRowId,
                                       onSave,
                                       onCancel,
                                       onEdit,
                                       onDelete,
                                       onEditFormula
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

            return (
                <a onClick={() => onEditFormula(record)}>
                    {record.formula.name}
                </a>
            );

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
                        <Button size="small" onClick={() => onSave(record)} icon={<SaveOutlined/>}/>
                        <Button size="small" onClick={() => onCancel(record)} icon={<RollbackOutlined />}/>
                    </div>
                );
            }

            return (
                <div style={{display: "flex", gap: 8}}>
                    <Button size="small" onClick={() => onEdit(record)} icon={<EditOutlined/>}/>
                    <Button size="small" danger onClick={() => onDelete(record)} icon={<CloseOutlined/>}/>
                </div>
            );
        }
    }
];

