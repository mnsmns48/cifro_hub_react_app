import {useState, useMemo, useCallback, useEffect} from "react";

import {Table, Button} from "antd";
import {AlignRightOutlined} from "@ant-design/icons";

import {exportParsingToExcel} from "./api.js";

import {fetchRangeRewardsProfiles} from "../RewardRangeSettings/api.js";

import {useParsingFilters} from "../Hook/useParsingFilters.js";
import {useParsingActions} from "../Hook/useParsingActions.js";

import {createParsingColumns} from "./ParsingResultsBlocks/ParsingResultsColumns.jsx";
import UploadImagesModal from "./ParsingResultsBlocks/UploadImagesModal.jsx";
import InHubDownloader from "./ParsingResultsBlocks/InHubDownloader.jsx";
import InfoSelect from "./ParsingResultsBlocks/InfoSelect.jsx";
import FeatureFilterModal from "./ParsingResultsBlocks/FeatureFilterModal.jsx";
import AttributesModal from "./ParsingResultsBlocks/AttributesModal.jsx";
import ParsingHeader from "./ParsingResultsBlocks/ParsingHeader.jsx";
import ParsingToolbar from "./ParsingResultsBlocks/ParsingToolbar.jsx";
import ParsingBulkActions from "./ParsingResultsBlocks/ParsingBulkActions.jsx";
import ParsingFloatingActions from "./ParsingResultsBlocks/ParsingFloatingActions.jsx";

import "../Css/ParsingResults.css";


const ParsingResults = ({url, result, vslId, onRangeChange}) => {
    const [rows, setRows] = useState(result.data ?? []);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
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

    const {filteredData} = useParsingFilters({
        rows,
        searchText,
        activeFilter,
        featureFilter
    });

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
                parsing_result: filteredData,
                dt_parsed: result.dt_parsed
                    ? new Date(result.dt_parsed).toISOString()
                    : null
            };

            await exportParsingToExcel(payload);
        } catch (error) {
            console.error("Ошибка при экспорте Excel:", error);
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

    const {
        updateRow,
        applyImageUpdate,
        handleDelete,
        handleClearMedia,
        handleClearFromHub,
        handleAddToHub,
        refreshParsingResult
    } = useParsingActions(
        {
            setRows,
            setSelectedRowKeys,
            vslId,
            profitRangeId: result.profit_range_id,
            setIsRefreshing
        });

    const countNoPreview = rows.filter(r => r.preview == null).length;
    const countNoFeatures = rows.filter(r => Array.isArray(r.features_title) && r.features_title.length === 0).length;
    const selectedItems = rows.filter(r => selectedRowKeys.includes(r.origin));

    return (
        <>
            <ParsingHeader url={url} result={result}/>

            <ParsingToolbar
                showInputPrice={showInputPrice}
                onTogglePrice={() => setShowInputPrice(v => !v)}

                onResetFilters={() => {
                    setActiveFilter("all");
                    setFeatureFilter([]);
                }}

                onFilterChange={setActiveFilter}

                countNoPreview={countNoPreview}
                countNoFeatures={countNoFeatures}
                countNoAttributes={countNoAttributes}

                searchText={searchText}
                onSearchChange={setSearchText}

                rewardOptions={rewardOptions}
                selectedRangeId={result.profit_range_id}
                onRangeChange={handleSelectRange}

                onExportExcel={downloadExcel}
            />

            <ParsingBulkActions
                selectedCount={selectedRowKeys.length}
                onDelete={() => handleDelete(selectedRowKeys)}
                onAddDependence={() => handleAddDependenceMulti(selectedRowKeys)}
                onAddToHub={() => setAddToHubModalVisible(true)}
                onClearMedia={() => handleClearMedia(selectedRowKeys)}
                onRemoveFromHub={() => handleClearFromHub(selectedRowKeys)}
            />

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
                   pagination={false}
                   rowKey="origin" tableLayout="fixed"
                   rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
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
                             onCancel={() => setAddToHubModalVisible(false)}
                             onConfirm={(msg, updatedOrigins) => {
                                 handleAddToHub(updatedOrigins);
                                 setAddToHubModalVisible(false);
                             }}/>


            <ParsingFloatingActions
                isRefreshing={isRefreshing}
                onRefresh={refreshParsingResult}
                onOpenFilter={() => setIsFilterModalOpen(true)}
            />


            <Button onClick={() => setIsFilterModalOpen(true)} className="circle-float-button filter-button">
                <AlignRightOutlined style={{fontSize: 20}}/>
            </Button>

            <FeatureFilterModal visible={isFilterModalOpen}
                                onClose={() => setIsFilterModalOpen(false)}
                                rows={rows}
                                onApply={(selected) => setFeatureFilter(selected)}
            />

            <UploadImagesModal
                isOpen={uploadModalOpen}
                originCode={currentOriginAndTitle?.origin}
                originTitle={currentOriginAndTitle?.title}
                onClose={() => setUploadModalOpen(false)}
                onUploaded={applyImageUpdate}
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
                    setAttributesModalData(prev => ({
                        ...prev,
                        images: uploaded.images,
                        preview: uploaded.preview
                    }));
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