import {Table, Image, Button} from "antd";
import {RightCircleOutlined} from "@ant-design/icons";
import "../Css/ParsingResults.css";
import {useState} from "react";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};


const ParsingResults = ({result}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            setSelectedRowKeys(keys);
        }
    };

    const toggleExpand = (rowKey) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(rowKey)) {
            newExpandedRows.delete(rowKey);
        } else {
            newExpandedRows.add(rowKey);
        }
        setExpandedRows(newExpandedRows);
    };

    return (
        <>
            <div>
                <p><strong>Категория:</strong> {result.category.map((item, index) => <span key={index}>{item} </span>)}
                </p>
                <p><strong>Дата и время:</strong> {formatDate(result.datetime_now)}</p>
            </div>
            <Table
                className="parsing-result-table"
                rowSelection={rowSelection}
                dataSource={result.data}
                tableLayout="fixed"
                rowKey="origin"
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
                    {title: "Название", dataIndex: "title", key: "title", width: 200},
                    {
                        title: "Цена",
                        dataIndex: "output_price",
                        key: "output_price",
                        align: "center",
                        render: (text) => <b style={{fontSize: "13px"}}>{text}</b>
                    },
                    {title: "Гарантия", dataIndex: "warranty", key: "warranty", align: "center"},
                    {

                        key: "details",
                        width: 100,
                        align: "center",
                        render: (_, record) => (
                            <>
                                {expandedRows.has(record.origin) && (
                                    <span style={{marginRight: "5x"}}>{record.input_price}</span>
                                )}
                                <Button
                                    type="text"
                                    icon={<RightCircleOutlined/>}
                                    onClick={() => toggleExpand(record.origin)}
                                />
                            </>
                        )
                    },
                    {title: "Доставка", dataIndex: "shipment", key: "shipment", align: "center"},
                    {title: "Дополнительно", dataIndex: "optional", key: "optional"},

                ]}
            />
        </>
    );
};

export default ParsingResults;
