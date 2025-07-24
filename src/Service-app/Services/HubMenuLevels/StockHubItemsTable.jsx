import { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import {fetchStockHubItems} from "./api.js";
import "./Css/Tree.css";


const StockHubItemsTable = ({ pathId, visible = true }) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        fetchStockHubItems(pathId)
            .then(data => setItems(data))
            .finally(() => setLoading(false));
    }, [pathId, visible]);

    const columns = [
        {
            dataIndex: "origin",
            key: "origin",
            width: 20
        },
        {
            dataIndex: "title",
            key: "title",
            width: 220
        },
        {
            dataIndex: "warranty",
            key: "warranty",
            width: 40
        },
        {
            dataIndex: "output_price",
            key: "output_price",
            width: 20
        },
        {
            dataIndex: "datestamp",
            key: "datestamp",
            width: 40,
            render: val =>
                val
                    ? new Date(val).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "-",
        },
        {
            dataIndex: "url",
            key: "url",
            width: 240,


        }
    ];

    if (!visible) return null;

    return loading ? (
        <div style={{ padding: 12, textAlign: "center", fontSize: 12 }}>
            <Spin size="small" />
        </div>
    ) : (
        <div style={{ margin: "10px 0"}}>
            <Table
                className="stockHubTable"
                dataSource={items}
                columns={columns}
                rowKey="origin"
                pagination={false}
                size="small"
                showHeader={false}
            />
        </div>
    );
}

export default StockHubItemsTable;
