import {getActionsColumn} from "./helpers.jsx";

export const getComposerColumns = ({onEditFormula}) =>
    [
        {
            title: "Тип",
            dataIndex: ["type", "type"],
            key: "type",
        },
        {
            title: "Источник",
            dataIndex: "source",
            key: "source",
        },
        {
            title: "Формула",
            dataIndex: ["formula", "name"],
            key: "formula",
            render: (_, record) => (
                <a onClick={() => onEditFormula(record)}>
                    {record.formula.name}
                </a>
            )
        },
        getActionsColumn({
            onEdit: (row) => console.log("edit composer", row),
            onSave: (row) => console.log("save composer", row),
            onCancel: (row) => console.log("cancel composer", row)
        })
    ];
