import {useState, useMemo, useCallback, useEffect} from "react";
import {Table, Button, Input, Select, Popconfirm, Spin, Badge, Tooltip} from "antd";
import "../Css/ParsingResults.css";
import {createParsingColumns} from "./ParsingResultsColumns.jsx";
import {clearMediaData, deleteParsingItems, exportParsingToExcel, reCalcOutputPrices} from "./api.js";
import UploadImagesModal from "./UploadImagesModal.jsx";
import {fetchRangeRewardsProfiles} from "../RewardRangeSettings/api.js";
import {
    AlignRightOutlined,
    BarsOutlined,
    CalculatorOutlined,
    CalendarOutlined, ClearOutlined, DeleteRowOutlined,
    EyeInvisibleOutlined,
    FileExcelOutlined, LinkOutlined, LoadingOutlined, PlusSquareOutlined,
    ReloadOutlined, RestOutlined, ShareAltOutlined,
    WarningOutlined
} from "@ant-design/icons";
import {formatDate} from "../../../../utils.js";
import InHubDownloader from "./InHubDownloader.jsx";
import {deleteStockItems} from "../HubMenuLevels/api.js";
import InfoSelect from "./InfoSelect.jsx";
import FeatureFilterModal from "./FeatureFilterModal.jsx";
import AttributesModal from "./AttributesModal.jsx";


const {Search} = Input;


const ParsingResults = ({url, result, vslId, onRangeChange}) => {
    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [pageSize, setPageSize] = useState(100);
    const [showInputPrice, setShowInputPrice] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentOriginAndTitle, setCurrentOriginAndTitle] = useState(null);
    const [rewardOptions, setRewardOptions] = useState([]);
    const [addToHubModalVisible, setAddToHubModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [dependencySelection, setDependencySelection] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [featureFilter, setFeatureFilter] = useState([]);
    const [attributesModalData, setAttributesModalData] = useState(null);
    const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);

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


    const toggleExpand = useCallback(
        key => setExpandedRows(prev => (prev === key ? null : key)),
        []
    );

    const filteredData = useMemo(() => {
        const q = searchText.toLowerCase().trim();

        return rows.filter(row => {
            const hasFeatures =
                Array.isArray(row.features_title) && row.features_title.length > 0;

            const hasAttributes =
                row.attributes &&
                Array.isArray(row.attributes.attr_value_ids) &&
                row.attributes.attr_value_ids.length > 0;

            if (activeFilter === "NoAttributes" && hasAttributes) return false;

            if (activeFilter === "noPreview" && row.preview) return false;
            if (activeFilter === "noFeatures" && hasFeatures) return false;

            if (featureFilter.length > 0) {
                const isNoFeatureSelected = featureFilter.includes("-------");

                if (isNoFeatureSelected && hasFeatures) return false;
                if (
                    !isNoFeatureSelected &&
                    (!hasFeatures ||
                        !featureFilter.some(f => row.features_title.includes(f)))
                ) {
                    return false;
                }
            }

            const titleMatch = (row.title ?? "").toLowerCase().includes(q);
            const originMatch = String(row.origin).includes(q);

            return titleMatch || originMatch;
        });
    }, [rows, activeFilter, searchText, featureFilter]);

    const countNoAttributes = useMemo(() => {
        return rows.filter(row => {
            const hasAttributes =
                row.attributes &&
                Array.isArray(row.attributes.attr_value_ids) &&
                row.attributes.attr_value_ids.length > 0;
            return !hasAttributes;
        }).length;
    }, [rows]);


    const openAttributesModal = useCallback((data) => {
        setAttributesModalData(data);
        setIsAttributesModalOpen(true);
    }, []);


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


    const openUploadModal = useCallback((origin, title) => {
        setCurrentOriginAndTitle({origin, title});
        setUploadModalOpen(true);
    }, []);


    const columns = useMemo(
        () =>
            createParsingColumns({
                setRows,
                showInputPrice,
                expandedRows,
                toggleExpand,
                openUploadModal,
                openAttributesModal
            }),
        [rows, setRows, showInputPrice, expandedRows, toggleExpand, openUploadModal, openAttributesModal]
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
        setSelectedRowKeys([])
        setRows(prev =>
            prev.map(row =>
                updatedOrigins.includes(row.origin)
                    ? {...row, in_hub: true}
                    : row
            )
        );
    };

    const handleClearFromHub = async (originsToClear) => {
        if (!originsToClear.length) return;
        try {
            const deletedOrigins = await deleteStockItems({origins: originsToClear});
            if (!Array.isArray(deletedOrigins) || deletedOrigins.length === 0) return;
            setRows(prev =>
                prev.map(row =>
                    deletedOrigins.includes(row.origin)
                        ? {...row, in_hub: false}
                        : row
                )
            );
            setSelectedRowKeys(prev =>
                prev.filter(origin => !deletedOrigins.includes(origin))
            );
        } catch (error) {
            console.error("Ошибка при удалении", error);
        }
    };

    const handleClearMedia = async (selectedOrigins) => {
        const cleared = await clearMediaData(selectedOrigins);
        setRows(prev =>
            prev.map(row =>
                cleared.includes(row.origin)
                    ? {...row, pics: [], preview: null}
                    : row
            )
        );

    };

    const refreshParsingResult = async () => {
        setIsRefreshing(true);
        setSelectedRowKeys([])
        try {
            const updated = await reCalcOutputPrices(vslId, result.profit_range_id);
            setRows(Array.isArray(updated.parsing_result) ? updated.parsing_result : []);
        } catch (error) {
            console.error("Ошибка при обновлении результатов:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleAddDependenceMulti = (selectedKeys) => {
        if (!selectedKeys.length) return;

        const selectedRecords = rows.filter(row => selectedKeys.includes(row.origin));
        const originList = selectedRecords.map(row => row.origin);
        const titleList = selectedRecords.map(row => String(row.title ?? "??"));


        const titleString = titleList.join(", ");

        setDependencySelection({
            origin: originList,
            titles: titleList,
            record: {title: titleString},
            setRows
        });
    };

    const updateRow = useCallback((origin, patch) => {
        setRows(prev =>
            prev.map(row =>
                row.origin === origin
                    ? {...row, ...patch}
                    : row
            )
        );
    }, []);


    const countNoPreview = rows.filter(r => r.preview == null).length;
    const countNoFeatures = rows.filter(r => Array.isArray(r.features_title) && r.features_title.length === 0).length;

    const spinIcon = <LoadingOutlined style={{fontSize: 18, color: "#e2fc2a"}} spin/>;

    return (
        <>
            <div>
                <p>
                    <strong>Собрано:</strong> {formatDate(result.dt_parsed)} <br/>
                    {result.duration && (
                        <>
                            <strong>Время:</strong> {Number(result.duration).toFixed(1)} сек<br/>
                        </>
                    )}

                    <strong>Количество:</strong> {Array.isArray(result.parsing_result) ? result.parsing_result.length : 0}<br/>
                    <strong>Ссылка:</strong> <a href={url} target="_blank" rel="noopener noreferrer"
                                                style={{color: '#999999', cursor: 'default'}}>{url}</a>
                </p>
            </div>

            <div style={{display: "flex", gap: 5, flexWrap: "wrap", padding: "12px 0"}}>
                <Button onClick={() => setShowInputPrice(v => !v)}>
                    {showInputPrice ? <CalendarOutlined/> : <CalculatorOutlined/>}</Button>
                <Button onClick={() => {
                    setActiveFilter("all");
                    setFeatureFilter([]);
                }}><BarsOutlined/></Button>
                <Badge count={countNoPreview} offset={[-8, -6]}>
                    <Button onClick={() => setActiveFilter("noPreview")}><EyeInvisibleOutlined/></Button>
                </Badge>
                <Badge count={countNoFeatures} offset={[-8, -6]}>
                    <Button onClick={() => setActiveFilter("noFeatures")}><DeleteRowOutlined/></Button>
                </Badge>
                <Badge count={countNoAttributes} offset={[-8, -6]}>
                    <Button onClick={() => setActiveFilter("NoAttributes")}><LinkOutlined/>
                    </Button>
                </Badge>

                <Search placeholder="Поиск по названию / коду товара" allowClear style={{maxWidth: 500}}
                        value={searchText} onChange={e => setSearchText(e.target.value)}/>
                <Tooltip title={"Профиль вознаграждения"}>
                    <Select style={{minWidth: 200}}
                            options={rewardOptions} defaultValue={result.profit_range_id} onChange={handleSelectRange}/>
                </Tooltip>
                <Button onClick={downloadExcel}><FileExcelOutlined/></Button>
            </div>

            {selectedRowKeys.length > 0 && (
                <div style={{display: "flex", gap: 10, marginBottom: 15}}>
                    <Popconfirm
                        title="Вы уверены, что хотите удалить выбранные позиции?"
                        onConfirm={handleDelete}
                        okText="Да"
                        cancelText="Нет"
                        placement="left"
                    >
                        <Button danger className="fixed-hub-button fixed-hub-button-delete">
                            Удалить навсегда ({selectedRowKeys.length}) <WarningOutlined/>
                        </Button>
                    </Popconfirm>

                    <Button onClick={() => handleAddDependenceMulti(selectedRowKeys)}
                            className="fixed-hub-button fixed-hub-button-dependency">
                        Зависимость ({selectedRowKeys.length}) <ShareAltOutlined/>
                    </Button>

                    <Button onClick={() => setAddToHubModalVisible(true)}
                            className="fixed-hub-button fixed-hub-button-add">
                        Добавить в Хаб ({selectedRowKeys.length}) <PlusSquareOutlined/>
                    </Button>

                    <Popconfirm title="Очистить медиа у выбранных позиций?"
                                description={`Будут удалены картинки и превью.`}
                                okText="Да, очистить" cancelText="Отмена"
                                onConfirm={() => handleClearMedia(selectedRowKeys)}
                                disabled={!selectedRowKeys.length}>
                        <Button
                            className="fixed-hub-button fixed-hub-button-clear-media" icon={<ClearOutlined/>}
                            disabled={!selectedRowKeys.length}>
                            Очистить медиа ({selectedRowKeys.length})
                        </Button>
                    </Popconfirm>

                    <Button onClick={() => handleClearFromHub(selectedRowKeys)}
                            className="fixed-hub-button fixed-hub-button-remove">
                        Убрать из хаба ({selectedRowKeys.length}) <RestOutlined/>
                    </Button>
                </div>
            )}
            {dependencySelection && (
                <InfoSelect
                    titles={dependencySelection.titles}
                    origin={dependencySelection.origin}
                    record={dependencySelection.record}
                    setRows={dependencySelection.setRows}
                    autoOpen={true}
                    onClose={() => {
                        setSelectedRowKeys([]);
                        setDependencySelection(null);
                    }}
                />
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
            <InHubDownloader vslId={vslId} isOpen={addToHubModalVisible} items={selectedItems}
                             onCancel={() => setAddToHubModalVisible(false)} onConfirm={handleAddToHub}/>
            <UploadImagesModal
                isOpen={uploadModalOpen}
                originCode={currentOriginAndTitle?.origin}
                originTitle={currentOriginAndTitle?.title}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={(data) => {
                    if (!currentOriginAndTitle) return;
                    handleImageUploaded(data, currentOriginAndTitle.origin);
                }}
            />


            {isRefreshing ? (
                <div className="circle-float-button refresh-float-button">
                    <Spin indicator={spinIcon}/>
                </div>
            ) : (
                <Button onClick={refreshParsingResult} className="circle-float-button refresh-float-button">
                    <ReloadOutlined style={{fontSize: 20}}/>
                </Button>
            )}
            <Button onClick={() => setIsFilterModalOpen(true)} className="circle-float-button filter-button">
                <AlignRightOutlined style={{fontSize: 20}}/>
            </Button>
            <FeatureFilterModal
                visible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                rows={rows}
                onApply={(selected) => setFeatureFilter(selected)}
            />
            <AttributesModal
                open={isAttributesModalOpen}
                data={attributesModalData}
                onClose={() => {
                    setIsAttributesModalOpen(false);
                    setAttributesModalData(null);
                }}

                onUploaded={(uploaded, origin) => {
                    updateRow(origin, {preview: uploaded.preview});
                }}

                onSaved={({origin, title, attributes}) => {
                    updateRow(origin, {
                        title,
                        attributes: {
                            model_id: rows.find(r => r.origin === origin)?.attributes?.model_id,
                            attr_value_ids: attributes
                        }
                    });
                }}
            />
        </>
    );
};

export default ParsingResults;