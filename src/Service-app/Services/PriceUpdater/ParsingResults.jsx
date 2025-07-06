import React, {
    useState,
    useMemo,
    useCallback,
    useEffect
} from "react";
import { Table, Button, Input, Select, message } from "antd";
import "../Css/ParsingResults.css";
import { createParsingColumns } from "./ParsingResultsColumns.jsx";
import { deleteParsingItems } from "./api.js";
import UploadImagesModal from "./UploadImagesModal.jsx";
import { fetchRangeRewardsProfiles } from "../RewardRangeSettings/api.js";

const { Search } = Input;

const formatDate = isoString => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 3);
    return date.toISOString().slice(0, 16).replace("T", " ");
};

const ParsingResults = ({ result, vslId, onRangeChange }) => {
    // Локальный стейт строк
    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShowInputPrice] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOrigin, setCurrentOrigin] = useState(null);

    const [rewardOptions, setRewardOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const [selectedReward, setSelectedReward] = useState(
        result.range_reward?.id ?? null
    );

    // 1) Сбрасываем rows и фильтры при каждом новом result.data
    useEffect(() => {
        setRows(Array.isArray(result.data) ? result.data : []);
        setSelectedRowKeys([]);
        setSearchText("");
        setActiveFilter("all");
        setExpandedRows(null);
        setSelectedReward(result.range_reward?.id ?? null);
    }, [result.data, result.range_reward]);

    // 2) Подгружаем профили вознаграждений один раз
    useEffect(() => {
        (async () => {
            setLoadingOptions(true);
            try {
                const resp = await fetchRangeRewardsProfiles();
                const list = Array.isArray(resp) ? resp : resp.data;
                setRewardOptions(
                    list.map(o => ({ label: o.title, value: o.id }))
                );
            } catch {
                message.error("Ошибка загрузки профилей");
            } finally {
                setLoadingOptions(false);
            }
        })();
    }, []);

    // 3) При смене профиля вызываем колбэк и ждем обновления по эффекту выше
    const handleSelectRange = async rangeId => {
        setSelectedReward(rangeId);
        await onRangeChange(vslId, rangeId);
    };

    const openUploadModal = useCallback(origin => {
        setCurrentOrigin(origin);
        setUploadModalOpen(true);
    }, []);

    const toggleExpand = useCallback(
        key => setExpandedRows(prev => (prev === key ? null : key)),
        []
    );

    // 4) Фильтрация + поиск
    const filteredData = useMemo(() => {
        let data = rows;

        if (activeFilter === "noPreview") {
            data = data.filter(r => !r.preview);
        } else if (activeFilter === "noFeatures") {
            data = data.filter(
                r =>
                    Array.isArray(r.features_title) &&
                    r.features_title.length === 0
            );
        }

        const q = searchText.toLowerCase();
        return data.filter(r =>
            (r.title ?? "").toLowerCase().includes(q)
        );
    }, [rows, activeFilter, searchText]);

    // 5) Колонки
    const columns = useMemo(
        () =>
            createParsingColumns({
                setRows,
                showInputPrice,
                expandedRows,
                toggleExpand,
                openUploadModal
            }),
        [setRows, showInputPrice, expandedRows, toggleExpand]
    );

    // 6) Удаление
    const handleDelete = async () => {
        if (!selectedRowKeys.length) return;
        try {
            await deleteParsingItems(selectedRowKeys);
            setRows(prev =>
                prev.filter(r => !selectedRowKeys.includes(r.origin))
            );
            setSelectedRowKeys([]);
        } catch {
            message.error("Ошибка при удалении");
        }
    };

    return (
        <>
            <div>
                <p>
                    <strong>Категория:</strong>{" "}
                    {Array.isArray(result.category)
                        ? result.category.map((c, i) => (
                            <span key={i}>{c} </span>
                        ))
                        : null}
                </p>
                <p>
                    <strong>Дата и время:</strong> {formatDate(result.datestamp)}
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                    padding: "15px 0"
                }}
            >
                <Button onClick={() => setShowInputPrice(v => !v)}>
                    {showInputPrice ? "Off" : "₽"}
                </Button>

                <Button
                    onClick={() => setActiveFilter("all")}
                    style={{ background: "yellowgreen" }}
                />
                <Button
                    onClick={() => setActiveFilter("noPreview")}
                    style={{ background: "yellow" }}
                />
                <Button
                    onClick={() => setActiveFilter("noFeatures")}
                    style={{ background: "red" }}
                />

                <Search
                    placeholder="Пиши что ищешь"
                    allowClear
                    style={{ maxWidth: 500 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />

                <Select
                    placeholder="Профиль вознаграждения"
                    style={{ minWidth: 200 }}
                    options={rewardOptions}
                    value={selectedReward}
                    loading={loadingOptions}
                    onChange={handleSelectRange}
                />
            </div>

            {selectedRowKeys.length > 0 && (
                <Button
                    danger
                    style={{ margin: "0 0 10px 10px" }}
                    onClick={handleDelete}
                >
                    Удалить ({selectedRowKeys.length})
                </Button>
            )}

            <Table
                className="parsing-result-table"
                dataSource={filteredData}
                columns={columns}
                // 7) rowKey — композит из origin + индекс, чтобы ключ всегда был уникален
                rowKey={(rec, idx) => `${rec.origin}-${idx}`}
                tableLayout="fixed"
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys
                }}
                pagination={{
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "25", "50", "100"],
                    onShowSizeChange: (_, size) => setPageSize(size)
                }}
                rowClassName={rec => {
                    const noF =
                        Array.isArray(rec.features_title) &&
                        rec.features_title.length === 0;
                    const noP = !rec.preview;
                    if (noF) return "row-no-features";
                    if (noP) return "row-no-image";
                    return "";
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
