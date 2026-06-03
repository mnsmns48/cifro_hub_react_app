export const getSpecsPathColumns = () => [
    {title: "Название", dataIndex: "title"},
    {
        title: "Категория",
        render: (_, row) => row.path?.[0] || "—"
    },
    {
        title: "Параметр",
        render: (_, row) => row.path?.[1] || "—"
    },
    {title: "Иконка", dataIndex: "icon"}
]