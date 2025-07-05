import {useState, useMemo, useCallback} from "react";
import {Table, Button, Input, Select, message} from "antd";
import "../Css/ParsingResults.css";
import {createParsingColumns} from "./ParsingResultsColumns.jsx";
import {deleteParsingItems} from "./api.js";
import UploadImagesModal from "./UploadImagesModal.jsx";

const {Search} = Input;


const FilterButton = ({onClick, bg}) => {
    return (
        <Button onClick={onClick} style={{
            backgroundColor: bg,
            borderRadius: "25%",
            width: 30,
            height: 30,
        }}
        />
    );
}


const formatDate = isoString => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};

const ParsingResults = ({result}) => {
    console.log(">>>------->>>> Проп result в ParsingResults:", result);

    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelected] = useState([]);
    const [expandedRows, setExpanded] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShow] = useState(false);
    const [searchText, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOrigin, setCurrentOrigin] = useState(null);

    const showAllItems = () => setActiveFilter("all");
    const showNoPreviewItems = () => setActiveFilter("noPreview");
    const showNoFeaturesItems = () => setActiveFilter("noFeatures");

    const openUploadModal = originCode => {
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
            data = data.filter(r => !r.preview);
        } else if (activeFilter === "noFeatures") {
            data = data.filter(
                r => Array.isArray(r.features_title) && r.features_title.length === 0
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
        try {
            await deleteParsingItems(selectedRowKeys);
            setRows(prev => prev.filter(r => !selectedRowKeys.includes(r.origin)));
            setSelected([]);
        } catch {
            message.error("Ошибка при удалении");
        }
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

            <div style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 15,
                padding: "15px 0",
            }}>
                <Button onClick={() => setShow(!showInputPrice)}>{showInputPrice ? "Off" : "₽"}</Button>
                <FilterButton onClick={showAllItems} bg="yellowgreen"/>
                <FilterButton onClick={showNoPreviewItems} bg="yellow"/>
                <FilterButton onClick={showNoFeaturesItems} bg="red"/>
                <Search placeholder="Пиши что ищешь" allowClear style={{maxWidth: 500}}
                        value={searchText}
                        onChange={e => setSearch(e.target.value)}/>
                <Select placeholder="Профиль вознаграждения" style={{minWidth: 200}}></Select>
            </div>

            {hasSelection && (
                <Button danger style={{marginBottom: 10, marginLeft: 10}} onClick={handleDelete}>
                    Удалить ({selectedRowKeys.length})
                </Button>
            )}

            <Table
                rowClassName={rec => {
                    const noFeatures =
                        Array.isArray(rec.features_title) && rec.features_title.length === 0;
                    const noPreview = !rec.preview;
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
                onUploaded={() => setUploadModalOpen(false)}
            />
        </>
    );
};

export default ParsingResults;