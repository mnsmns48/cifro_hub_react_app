import { Tag } from "antd";

const getConsentTableColumns = () => [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: "Origin",
        dataIndex: "origin",
        key: "origin",
        width: 120,
        render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
        title: "VSL",
        dataIndex: "vsl_id",
        key: "vsl_id",
        width: 100,
        render: (val) => <Tag color="blue">#{val}</Tag>,
    },
    {
        title: "Гарантия",
        dataIndex: "warranty",
        key: "warranty",
        render: (text) =>
            text ? <Tag color="green">{text}</Tag> : <span style={{ color: "#999" }}>—</span>,
    },
    {
        title: "Цена (вход)",
        dataIndex: "input_price",
        key: "input_price",
        align: "right",
        render: (val) =>
            typeof val === "number" ? `${val.toFixed(2)} ₽` : <span style={{ color: "#999" }}>—</span>,
        sorter: (a, b) => a.input_price - b.input_price,
    },
    {
        title: "Цена (выход)",
        dataIndex: "output_price",
        key: "output_price",
        align: "right",
        render: (val) =>
            typeof val === "number" ? `${val.toFixed(2)} ₽` : <span style={{ color: "#999" }}>—</span>,
        sorter: (a, b) => a.output_price - b.output_price,
    },
    {
        title: "Добавлено",
        dataIndex: "added_at",
        key: "added_at",
        render: (val) =>
            val
                ? new Date(val).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : <span style={{ color: "#999" }}>—</span>,
        sorter: (a, b) => new Date(a.added_at) - new Date(b.added_at),
    },
    {
        title: "Обновлено",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (val) =>
            val
                ? new Date(val).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : <span style={{ color: "#999" }}>—</span>,
        sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    },
];

export default getConsentTableColumns;
