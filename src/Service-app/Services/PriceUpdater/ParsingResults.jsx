import {Table, Image, Button} from "antd";
import {RightCircleOutlined} from "@ant-design/icons";
import "../Css/ParsingResults.css";
import {useState} from "react";
import Search from "antd/es/input/Search.js";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};


const ParsingResults = ({result}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShowInputPrice] = useState(true);
    const [searchText, setSearchText] = useState("");

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            setSelectedRowKeys(keys);
        }
    };

    const toggleExpand = (rowKey) => {
        setExpandedRows(expandedRows === rowKey ? null : rowKey);
    };

    const filteredData = result.data.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <div>
                <p><strong>Категория:</strong> {result.category.map((item, index) => <span key={index}>{item} </span>)}
                </p>
                <p><strong>Дата и время:</strong> {formatDate(result.datetime_now)}</p>
            </div>
            <Button
                onClick={() => setShowInputPrice(!showInputPrice)}
                style={{marginBottom: 10}}
            >
                {showInputPrice ? "On" : "Off"}
            </Button>
            <Search
                placeholder="Что ищем"
                allowClear
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
                style={{maxWidth: 500, marginLeft: 10}}
            />
            <Table
                className="parsing-result-table"
                rowSelection={rowSelection}
                dataSource={filteredData}
                tableLayout="fixed"

                rowKey="origin"
                pagination={{
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "25", "50", "100"],
                    onShowSizeChange: (_, newSize) => setPageSize(newSize),
                }}
                columns={[
                    {
                        title: "Изображение",
                        dataIndex: "preview",
                        align: "center",
                        key: "preview",
                        render: (text, record) => (
                            <Image width={60} src={text || "/10000.png"} alt={record.title}/>
                        )
                    },
                    {title: "Название", dataIndex: "title", key: "title", width: 250},
                    {
                        title: "Вход",
                        dataIndex: "input_price",
                        key: "input_price",
                        width: 100,
                        align: "center",
                        render: (text, record) =>
                            showInputPrice ? (<span style={{color: "grey"}}>{text}</span>)
                                : expandedRows === record.origin ? (
                                    <span style={{color: "grey"}}>{text}</span>
                                ) : (
                                    ""
                                )
                    },
                    {
                        title: "Цена",
                        dataIndex: "output_price",
                        key: "output_price",
                        width: 200,
                        align: "center",
                        render: (text) => <b style={{fontSize: "16px"}}>{text}</b>
                    },
                    {
                        title: "Детали",
                        key: "details",
                        width: 100,
                        align: "center",
                        render: (_, record) => (
                            <Button type="text" icon={<RightCircleOutlined/>}
                                    onClick={() => toggleExpand(record.origin)}/>
                        )
                    },
                    {title: "Гарантия", dataIndex: "warranty", key: "warranty", align: "center", width: 70},
                    {title: "Доставка", dataIndex: "shipment", key: "shipment", align: "center"},
                    {title: "Дополнительно", dataIndex: "optional", key: "optional"},
                ].filter(Boolean)}
            />
        </>
    );
};

export default ParsingResults;
