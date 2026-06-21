import {Button, Checkbox, Space} from "antd";
import {SaveOutlined, UndoOutlined} from "@ant-design/icons";

export function getModalVendorApiSearchLinesColumns(isLinked) {
    return [
        {
            title: "",
            dataIndex: "id",
            width: 40,
            render: (id) => <Checkbox checked={isLinked(id)} />
        },
        {
            title: "Название",
            dataIndex: "title",
            width: 260,
            ellipsis: true,
            render: (text) => (
                <div style={{ fontWeight: 600 }}>
                    {text}
                </div>
            )
        },
        {
            title: "Бренды",
            dataIndex: "brands",
            width: 180,
            ellipsis: true,
            render: (brands) => {
                if (!brands) return "";

                const arr = [];
                for (let i = 0; i < brands.length; i++) {
                    arr.push(brands[i].brand);
                }
                return arr.join(", ");
            }
        },
        {
            title: "Дата",
            dataIndex: "dt_parsed",
            width: 160,
            sorter: (a, b) => new Date(a.dt_parsed) - new Date(b.dt_parsed),
            render: (dt) =>
                dt ? new Date(dt).toLocaleString("ru-RU") : "—"
        },
        {
            title: "URL",
            dataIndex: "url",
            ellipsis: true,
            render: (url) => (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "#999" }}
                >
                    {url}
                </a>
            )
        },
        {
            key: "actions",
            width: 80,
            align: "center",
            render: (_, record) => {
                if (record.__isNew) {
                    return (
                        <Space>
                            <Button size="small" icon={<SaveOutlined />} onClick={handleSaveNew} />
                            <Button size="small" icon={<UndoOutlined />} onClick={handleUndo} />
                        </Space>
                    );
                }
                return null;
            }
        }
    ];
}
