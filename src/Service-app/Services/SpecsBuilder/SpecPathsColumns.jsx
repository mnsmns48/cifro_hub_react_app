export const getSpecPathsTableColumns = () => [
    {
        title: "Переменная",
        dataIndex: "title",
        width: "25%",
        align: "center",
    },
    {
        title: "Категория",
        align: "center",
        width: "30%",
        render: (_, record) => record.path?.[0] ?? "—"
    },
    {
        title: "Параметр",
        align: "center",
        width: "30%",
        render: (_, record) => record.path?.[1] ?? "—"
    },
    {
        dataIndex: "icon",
        align: "center",
        width: "15%",
        ellipsis: true
    }
];
