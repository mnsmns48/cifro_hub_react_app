import {useState, useEffect, useMemo, useCallback} from "react";
import {Table, Button, Input} from "antd";
import "../Css/ParsingResults.css";
import {createParsingColumns} from "./parsingColumns.jsx";
import {deleteParsingItems} from "./api.js";

const {Search} = Input;

const formatDate = isoString => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};


const ParsingResults = ({result}) => {
    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelected] = useState([]);
    const [expandedRows, setExpanded] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShow] = useState(false);
    const [searchText, setSearch] = useState("");


    useEffect(() => setRows(result.data ?? []), [result.data]);


    const toggleExpand = useCallback(
        key => setExpanded(prev => (prev === key ? null : key)),
        []
    );

    const filteredData = useMemo(() => {
        const q = searchText.toLowerCase();
        return rows.filter(r => (r.title ?? "").toLowerCase().includes(q));
    }, [rows, searchText]);

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelected,
    };

    const handleDelete = async () => {
        if (!selectedRowKeys.length) return;
        await deleteParsingItems(selectedRowKeys);
        setRows(prev => prev.filter(row => !selectedRowKeys.includes(row.origin)));
        setSelected([]);
    };


    const columnsObj = useMemo(
        () =>
            createParsingColumns({
                setRows,
                showInputPrice,
                expandedRows,
                toggleExpand,
            }),
        [setRows, showInputPrice, expandedRows, toggleExpand]
    );

    const hasSelection = selectedRowKeys.length > 0;


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
            <Button onClick={() => setShow(!showInputPrice)} style={{marginBottom: 10}}>
                {showInputPrice ? "Off" : " ₽ "}
            </Button>

            <Search
                placeholder="Пиши что ищешь"
                allowClear
                style={{maxWidth: 500, marginLeft: 10}}
                value={searchText}
                onChange={e => setSearch(e.target.value)}
            />

            {hasSelection && (
                <Button danger style={{marginBottom: 10, marginLeft: 10}} onClick={handleDelete}>
                    Удалить ({selectedRowKeys.length})
                </Button>
            )}

            <Table
                rowClassName={record => {
                    const noFeatures = Array.isArray(record.features_title) && record.features_title.length === 0;
                    const noPreview = !record.preview;
                    if (noFeatures) return "row-no-features";
                    if (noPreview) return "row-no-image";
                    return "";
                }}
                className="parsing-result-table"
                dataSource={filteredData}
                columns={columnsObj}
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
