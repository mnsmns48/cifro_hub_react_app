import {useState, useEffect, useMemo, useCallback} from "react";
import {Table, Button, Input, Select} from "antd";
import "../Css/ParsingResults.css";
import {createParsingColumns} from "./ParsingResultsColumns.jsx";
import {deleteParsingItems} from "./api.js";
import UploadImagesModal from "./UploadImagesModal.jsx";

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
    const [activeFilter, setActiveFilter] = useState("all");

    const showAllItems = () => setActiveFilter("all");
    const showNoPreviewItems = () => setActiveFilter("noPreview");
    const showNoFeaturesItems = () => setActiveFilter("noFeatures");

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOrigin, setCurrentOrigin] = useState(null);

    useEffect(() => setRows(result.data ?? []), [result.data]);


    const openUploadModal = (originCode) => {
        setCurrentOrigin(originCode);
        setUploadModalOpen(true);
    };

    const toggleExpand = useCallback(
        key => setExpanded(prev => (prev === key ? null : key)),
        []
    );

    const filteredData = useMemo(() => {
        let data = rows;
        if (activeFilter === "noPreview") {
            data = data.filter(record => !record.preview);
        } else if (activeFilter === "noFeatures") {
            data = data.filter(
                record =>
                    Array.isArray(record.features_title) &&
                    record.features_title.length === 0
            );
        }
        const q = searchText.toLowerCase();
        return data.filter(r => (r.title ?? "").toLowerCase().includes(q));
    }, [rows, activeFilter, searchText]);

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
                openUploadModal,
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
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 15, padding: '15px 0' }}>
                <Button onClick={() => setShow(!showInputPrice)}>{showInputPrice ? "Off" : " ₽ "}</Button>
                <Button onClick={showAllItems} style={{backgroundColor: 'yellowgreen', borderRadius: '25%', width: 30, height: 30}}/>
                <Button onClick={showNoPreviewItems} style={{backgroundColor: 'yellow', borderRadius: '25%', width: 30, height: 30}}/>
                <Button onClick={showNoFeaturesItems} style={{backgroundColor: 'red', borderRadius: '25%', width: 30, height: 30}}/>
                <Search placeholder="Пиши что ищешь" allowClear style={{ maxWidth: 500 }}
                    value={searchText} onChange={e => setSearch(e.target.value)}/>
                <Select placeholder="Профиль" style={{ minWidth: 180 }} allowClear></Select>

            </div>

            {hasSelection && (
                <Button danger style={{marginBottom: 10, marginLeft: 10}} onClick={handleDelete}>
                    Удалить ({selectedRowKeys.length})
                </Button>
            )}

            <Table
                rowClassName={record => {
                    const noFeatures =
                        Array.isArray(record.features_title) &&
                        record.features_title.length === 0;
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
            <UploadImagesModal
                isOpen={uploadModalOpen}
                originCode={currentOrigin}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={() => {
                    setUploadModalOpen(false);
                }}
            />
        </>
    );
};

export default ParsingResults;
