export const getComposerColumns = ({onEditFormula}) =>
    [
        {
            title: "Тип",
            dataIndex: ["type", "type"],
            key: "type",
        },
        {
            title: "Бренд",
            dataIndex: ["brand", "brand"],
            key: "brand",
            render: (value) => value || "—",
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
                <a onClick={() => onEditFormula(record.formula)}>
                    {record.formula.name}
                </a>
            )
        },
    ];
