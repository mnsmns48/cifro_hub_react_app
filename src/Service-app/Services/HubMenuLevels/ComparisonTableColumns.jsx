import ComparisonProgress from "./ComparisonProgress.jsx";
import {Checkbox} from "antd";


const getComparisonTableColumns  = ( setRows ) => [
    {
        title: "Sync",
        dataIndex: "sync",
        key: "sync",
        width: 20,
        render: (value, record) => (
            <Checkbox
                checked={!!value}
                onChange={(e) => {
                    const checked = e.target.checked;
                    setRows(prev =>
                        prev.map(row =>
                            row.id === record.id ? { ...row, sync: checked } : row
                        )
                    );
                }}
            />
        )
    },
    {
        dataIndex: "title",
        key: "title",
        render: (text) => text || <span style={{ color: "#999" }}>—</span>,
    },
    {
        title: "Актуально",
        dataIndex: "dt_parsed",
        key: "dt_parsed",
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
    },
    {
        dataIndex: "url",
        key: "url",
        render: (text) => (
            <a href={text} target="_blank" rel="noopener noreferrer" style={{ wordBreak: "break-word" }}>
                {text}
            </a>
        ),
    },
    {
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
            <ComparisonProgress status={record.status || "pending"} percent={record.progress || 0} />
        ),
    },
];

export default getComparisonTableColumns;