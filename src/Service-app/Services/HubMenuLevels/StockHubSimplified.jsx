import {useEffect, useState} from "react";
import {fetchStockHubItems} from "./api.js";
import {Spin, Table} from "antd";
import {DownSquareOutlined, UpSquareOutlined} from "@ant-design/icons";

const StockHubSimplified = ({pathId, visible = true, existingItems = []}) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!visible || !expanded) return;
        setLoading(true);
        fetchStockHubItems(pathId)
            .then(data => {
                const existingOrigins = new Set(existingItems.map(i => i.origin));
                const existingTitles = new Set(existingItems.map(i => i.title));

                const marked = data.map(item => ({
                    ...item,
                    isDuplicate: existingOrigins.has(item.origin) || existingTitles.has(item.title)
                }));
                setItems(marked);
            })
            .finally(() => setLoading(false));
    }, [pathId, visible, expanded, existingItems]);


    const columns = [
        {
            dataIndex: "origin",
            key: "origin",
            width: 20,
            render: (text, record) => (
                <span style={record.isDuplicate ? {backgroundColor: "#ff9d96"} : {}}>
        {text}
      </span>
            )
        },
        {
            dataIndex: "title",
            key: "title",
            width: 350,
            render: (text, record) => (
                <span style={record.isDuplicate ? {backgroundColor: "#ff9d96"} : {}}>
        {text}
      </span>
            )
        },
        {
            dataIndex: "output_price",
            key: "output_price",
            width: 80,

        }
    ];


    return (
        <div style={{margin: "15px"}}>
            <div
                onClick={() => setExpanded(prev => !prev)}
                style={{padding: "10px", borderRadius: 6, transition: "background 0.2s ease"}}
            >
                {expanded ? <UpSquareOutlined style={{fontSize: 20}}/> : <DownSquareOutlined style={{fontSize: 20}}/>}
            </div>

            {expanded && (
                loading ? (
                    <div style={{padding: 12, textAlign: "center", fontSize: 12}}>
                        <Spin size="small"/>
                    </div>
                ) : (
                    <Table
                        dataSource={items}
                        columns={columns}
                        rowKey="origin"
                        pagination={false}
                        size="small"
                    />

                )
            )}
        </div>
    );
};

export default StockHubSimplified;
