import { useState, useEffect, useMemo } from "react";
import { Table, Image, Button, Input } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import InfoSelect from "./InfoSelect.jsx";
import { updateParsingItem } from "./api.js";
import "../Css/ParsingResults.css";

const { Search } = Input;


const formatDate = isoString => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};


const ParsingResults = ({ result }) => {
    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShowInputPrice] = useState(false);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setRows(result.data ?? []);
    }, [result.data]);

    const filteredData = useMemo(() => {
        const q = searchText.toLowerCase();
        return rows.filter(item => item.title.toLowerCase().includes(q));
    }, [rows, searchText]);

    const toggleExpand = rowKey =>
        setExpandedRows(expandedRows === rowKey ? null : rowKey);

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    const columns = [
        {
            title: "Изображение",
            dataIndex: "preview",
            key: "preview",
            align: "center",
            render: (src, record) => (
                <Image width={60} src={src || "/10000.png"} alt={record.title} />
            ),
        },
        {
            title: "Название",
            dataIndex: "title",
            key: "title",
            width: 250,
            render: (text, record, index) => (
                <div
                    contentEditable
                    suppressContentEditableWarning
                    style={{ cursor: "text" }}
                    onBlur={async e => {
                        const newVal = e.target.innerText.trim();
                        if (!newVal || newVal === text) return;
                        setRows(prev => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], title: newVal };
                            return copy;
                        });
                        const res = await updateParsingItem(record.origin, {
                            new_title: newVal,
                        });
                        if (!res.is_ok) console.error("Ошибка:", res.message);
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            dataIndex: "input_price",
            key: "input_price",
            width: 100,
            align: "center",
            render: (text, record) =>
                showInputPrice || expandedRows === record.origin ? (
                    <span style={{ color: "grey" }}>{text}</span>
                ) : (
                    ""
                ),
        },
        {
            key: "details",
            width: 40,
            align: "center",
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<RightCircleOutlined />}
                    onClick={() => toggleExpand(record.origin)}
                />
            ),
        },
        {
            title: "Цена",
            dataIndex: "output_price",
            key: "output_price",
            sorter: (a, b) => parseFloat(a.output_price) - parseFloat(b.output_price),
            sortOrder: "ascend",
            width: 120,
            align: "center",
            render: text => <b style={{ fontSize: 16 }}>{text}</b>,
        },
        {
            title: "Гарантия",
            dataIndex: "warranty",
            key: "warranty",
            align: "center",
            width: 70,
        },
        { title: "Доставка", dataIndex: "shipment", key: "shipment", align: "center" },
        { title: "Дополнительно", dataIndex: "optional", key: "optional" },
        {
            title: "Описание",
            dataIndex: "info",
            key: "info",
            width: 205,
            render: info => <InfoSelect info={info} />,
        },
    ];

    return (
        <>
            <div>
                <p>
                    <strong>Категория:</strong>{" "}
                    {result.category.map((c, i) => (
                        <span key={i}>{c} </span>
                    ))}
                </p>
                <p>
                    <strong>Дата и время:</strong> {formatDate(result.datestamp)}
                </p>
            </div>

            <Button onClick={() => setShowInputPrice(!showInputPrice)} style={{ marginBottom: 10 }}>
                {showInputPrice ? "Off" : "On"}
            </Button>

            <Search
                placeholder="Что ищем"
                allowClear
                style={{ maxWidth: 500, marginLeft: 10 }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
            />

            <Table
                className="parsing-result-table"
                dataSource={filteredData}
                columns={columns}
                rowKey="origin"
                tableLayout="fixed"
                rowSelection={rowSelection}
                pagination={{
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "25", "50", "100"],
                    onShowSizeChange: (_, size) => setPageSize(size),
                }}
            />
        </>
    );
};

export default ParsingResults;
