import {useState, useMemo, useCallback, useEffect} from "react";
import {Table, Button, Input, Select, Popconfirm, Spin} from "antd";
import "../Css/ParsingResults.css";
import {createParsingColumns} from "./ParsingResultsColumns.jsx";
import {deleteParsingItems, exportParsingToExcel, reCalcOutputPrices} from "./api.js";
import UploadImagesModal from "./UploadImagesModal.jsx";
import {fetchRangeRewardsProfiles} from "../RewardRangeSettings/api.js";
import {FileExcelOutlined, PercentageOutlined, ReloadOutlined} from "@ant-design/icons";
import {formatDate} from "../../../../utils.js";
import InHubDownloader from "./InHubDownloader.jsx";
import MyModal from "../../../Ui/MyModal.jsx";


const {Search} = Input;


const ParsingResults = ({result, vslId, onRangeChange}) => {
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
    const [addToHubModalVisible, setAddToHubModalVisible] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);


    useEffect(() => {
        setRows(Array.isArray(result.parsing_result) ? result.parsing_result : []);
        setSelectedRowKeys([]);
        setSearchText("");
        setActiveFilter("all");
        setExpandedRows(null);
    }, [result.parsing_result, result.profit_range_id]);


    useEffect(() => {
        (async () => {
            try {
                const resp = await fetchRangeRewardsProfiles();
                const list = Array.isArray(resp) ? resp : resp.data;
                setRewardOptions(
                    list.map(o => ({label: o.title, value: o.id}))
                );
            } catch {
                console.error("Ошибка загрузки профилей");
            }
        })();
    }, []);

    const handleSelectRange = async rangeId => {
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

    const filteredData = useMemo(() => {
        let data = rows;

        if (activeFilter === "noPreview") {
            data = data.filter(r => !r.preview);
        } else if (activeFilter === "noFeatures") {
            data = data.filter(r => Array.isArray(r.features_title) && r.features_title.length === 0);
        }

        const q = searchText.toLowerCase().trim();

        return data.filter(r => {
            const titleMatch = (r.title ?? "").toLowerCase().includes(q);
            const originMatch = String(r.origin).includes(q);
            return titleMatch || originMatch;
        });
    }, [rows, activeFilter, searchText]);


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

    const handleDelete = async () => {
        if (!selectedRowKeys.length) return;
        try {
            await deleteParsingItems(selectedRowKeys);
            setRows(prev =>
                prev.filter(r => !selectedRowKeys.includes(r.origin))
            );
            setSelectedRowKeys([]);
        } catch {
            console.error("Ошибка при удалении");
        }
    };

    const handleImageUploaded = useCallback(
        ({images, preview}, origin) => {
            setRows(prev =>
                prev.map(r =>
                    r.origin !== origin
                        ? r
                        : {...r, images, preview}
                )
            );
        },
        [setRows]
    );

    const downloadExcel = async () => {
        try {
            const payload = {
                ...result,
                dt_parsed: result.dt_parsed ? new Date(result.dt_parsed).toISOString() : null
            };
            await exportParsingToExcel(payload);
        } catch (error) {
            console.error("Ошибка при экспорте Excel:", error);
        }
    };

    const selectedItems = rows.filter(r => selectedRowKeys.includes(r.origin));

    const handleAddToHub = (msg, updatedOrigins) => {
        setAddToHubModalVisible(false);
        setSuccessMessage(msg);
        setIsSuccessModalOpen(true);
        setRows(prev =>
            prev.map(row =>
                updatedOrigins.includes(row.origin)
                    ? {...row, in_hub: true}
                    : row
            )
        );
    };

    const refreshParsingResult = async () => {
        setIsRefreshing(true);
        try {
            const updated = await reCalcOutputPrices(vslId, result.profit_range_id);
            setRows(Array.isArray(updated.parsing_result) ? updated.parsing_result : []);
        } catch (error) {
            console.error("Ошибка при обновлении результатов:", error);
        } finally {
            setIsRefreshing(false);
        }
    };


    return (
        <>
            <div>
                <p>
                    <strong>Собрано:</strong> {formatDate(result.dt_parsed)} <br/>
                    <strong>Количество:</strong> {Array.isArray(result.parsing_result) ? result.parsing_result.length : 0}
                </p>
            </div>

            <div style={{display: "flex", gap: 5, flexWrap: "wrap", padding: "15px 0"}}>
                <Button onClick={() => setShowInputPrice(v => !v)}>{showInputPrice ? "Off" :
                    <PercentageOutlined/>}</Button>
                <Button onClick={() => setActiveFilter("all")} style={{background: "yellowgreen"}}/>
                <Button onClick={() => setActiveFilter("noPreview")} style={{background: "yellow"}}/>
                <Button onClick={() => setActiveFilter("noFeatures")} style={{background: "red"}}/>
                <Search placeholder="Поиск по названию / коду товара" allowClear style={{maxWidth: 500}}
                        value={searchText} onChange={e => setSearchText(e.target.value)}/>
                <Select style={{minWidth: 200}}
                        options={rewardOptions} defaultValue={result.profit_range_id} onChange={handleSelectRange}/>
                <Button
                    type="text"
                    icon={<FileExcelOutlined style={{fontSize: 20, color: "#52c41a"}}/>}
                    onClick={downloadExcel}
                    title="Скачать Excel"
                />
            </div>

            {selectedRowKeys.length > 0 && (
                <Popconfirm
                    title="Вы уверены, что хотите удалить выбранные позиции?"
                    onConfirm={handleDelete}
                    okText="Да"
                    cancelText="Нет"
                    placement="left"
                >
                    <Button danger className="fixed-hub-button fixed-hub-button-delete">
                        Удалить ({selectedRowKeys.length})
                    </Button>
                </Popconfirm>
            )}
            {selectedRowKeys.length > 0 && (
                <Button onClick={() => setSelectedRowKeys([])} className="fixed-hub-button fixed-hub-button-clear">
                    Снять выделение ({selectedRowKeys.length})
                </Button>
            )}
            {selectedRowKeys.length > 0 && (
                <Button type="primary" onClick={() => setAddToHubModalVisible(true)}
                        className="fixed-hub-button fixed-hub-button-add">
                    Добавить в Хаб ({selectedRowKeys.length})
                </Button>
            )}

            <Table className="parsing-result-table"
                   dataSource={filteredData}
                   columns={columns}
                   rowKey="origin" tableLayout="fixed"
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

            <InHubDownloader
                vslId={vslId}
                isOpen={addToHubModalVisible}
                items={selectedItems}
                onCancel={() => setAddToHubModalVisible(false)}
                onConfirm={handleAddToHub}
            />

            <UploadImagesModal
                isOpen={uploadModalOpen}
                originCode={currentOrigin}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={(data) => handleImageUploaded(data, currentOrigin)}
            />
            {isRefreshing ? (
                <div className="refresh-float-button">
                    <Spin size="small" />
                </div>
            ) : (
                <Button onClick={refreshParsingResult} className="refresh-float-button">
                    <ReloadOutlined style={{fontSize: 24}} />
                </Button>
            )}
            <MyModal
                isOpen={isSuccessModalOpen}
                content={successMessage}
                onConfirm={() => {
                    setIsSuccessModalOpen(false);
                    // setSelectedRowKeys([]);
                }}
                onCancel={() => setIsSuccessModalOpen(false)}
                footer={<button onClick={() => setIsSuccessModalOpen(false)}>Ок</button>}
            />
        </>
    );
};

export default ParsingResults;