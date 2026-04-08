import {useEffect, useState} from "react";
import {Badge, Button, Modal, Table} from "antd";
import {fetchPostData} from "../SchemeAttributes/api.js";
import {getUnidentifiedOriginsColumns} from "./unidentifiedOriginsColumns.jsx";
import {LinkOutlined, QuestionOutlined, ShareAltOutlined} from "@ant-design/icons";
import "./Css/UnidentifiedOriginsComponent.css";
import InfoSelect from "../PriceUpdater/ParsingResultsBlocks/InfoSelect.jsx";
import AttributesModal from "../PriceUpdater/ParsingResultsBlocks/AttributesModal.jsx";


const UnidentifiedOriginsComponent = ({
                                          comparisonObj: {vsl_list, path_ids},
                                          isOpen,
                                          onClose
                                      }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filtersState, setFiltersState] = useState({});
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [filters, setFilters] = useState({models: [], types: [], brands: []});
    const [missingModelFilterActive, setMissingModelFilterActive] = useState(false);
    const [missingAttrsFilterActive, setMissingAttrsFilterActive] = useState(false);
    const [dependencySelection, setDependencySelection] = useState(null);
    const [rows, setRows] = useState([]);
    const [attributesModalData, setAttributesModalData] = useState(null);


    const reloadData = async () => {
        setLoading(true);

        const payload = {vsl_list, path_ids};
        const response = await fetchPostData("/service/fetch_unidentified_origins", payload);

        if (response?.origins) {
            const origins = response.origins;
            const grouped = groupByVsl(origins, vsl_list);

            setRows(origins);
            setExpandedRowKeys(grouped.map(g => g.key));

            const modelSet = new Set();
            const typeSet = new Set();
            const brandSet = new Set();

            for (const item of origins) {
                if (item.model_title) modelSet.add(item.model_title);
                if (item.type_?.type) typeSet.add(item.type_.type);
                if (item.brand?.brand) brandSet.add(item.brand.brand);
            }

            setFilters({
                models: [...modelSet].map(v => ({text: v, value: v})),
                types: [...typeSet].map(v => ({text: v, value: v})),
                brands: [...brandSet].map(v => ({text: v, value: v}))
            });
        }

        setLoading(false);
    };


    useEffect(() => {
        if (isOpen) void reloadData();
    }, [isOpen, vsl_list, path_ids]);


    useEffect(() => {
        setExpandedRowKeys(data.map(g => g.key));
    }, [data]);

    useEffect(() => {
        const synced = rows.map(row => {
            const hasFeatureArray = Array.isArray(row.features_title);
            const hasSelectedFeature = hasFeatureArray && row.features_title.length > 0;

            return {
                ...row,
                model: hasSelectedFeature
                    ? {
                        model_id: row.model?.model_id ?? null,
                        model_title: row.features_title[0]
                    }
                    : hasFeatureArray
                        ? null
                        : row.model,
                brand: hasFeatureArray && !hasSelectedFeature ? null : row.brand,
                type_: hasFeatureArray && !hasSelectedFeature ? null : row.type_
            };
        });


        const grouped = groupByVsl(synced, vsl_list);
        const filtered = applyFilters(
            grouped,
            filtersState,
            missingModelFilterActive,
            missingAttrsFilterActive
        );

        setData(filtered);
        setSelectedRowKeys([])
    }, [rows, filtersState, missingModelFilterActive, missingAttrsFilterActive]);


    const updateRow = (origin, patch) => {
        setRows(prev =>
            prev.map(row =>
                row.origin === origin
                    ? {
                        ...row,
                        ...patch,
                        model: patch.model ?? row.model,
                        features_title: patch.features_title ?? row.features_title
                    }
                    : row
            )
        );
    };


    const groupByVsl = (origins, vslList) => {
        return vslList
            .map(vsl => {
                const children = origins
                    .filter(o => o.vsl_id === vsl.id)
                    .map((o, idx) => ({
                        ...o,
                        key: `origin-${vsl.id}-${idx}`
                    }));

                if (!children.length) return null;

                const missingFeatureCount = children.filter(c => !c.model?.model_title).length;

                return {
                    key: `vsl-${vsl.id}`,
                    vsl_id: vsl.id,
                    vsl_title: vsl.title,
                    missingFeatureCount,
                    children
                };
            })
            .filter(Boolean);
    };


    const applyFilters = (data, filters, missingFeatureOnly, missingAttrsOnly) => {
        const noFilters =
            Object.values(filters).every(v => !v || v.length === 0) &&
            !missingFeatureOnly &&
            !missingAttrsOnly;

        if (noFilters) return data;

        return data
            .map(group => {
                let children = [...group.children];

                const filterRules = [
                    [filters.models, c => filters.models.includes(c.model?.model_title)],
                    [filters.type_, c => filters.type_.includes(c.type_?.type)],
                    [filters.brand, c => filters.brand.includes(c.brand?.brand)],
                    [filters.have_images, c => filters.have_images.includes(c.have_images)],
                    [filters.model_in_hub, c => filters.model_in_hub.includes(c.model_in_hub)],
                ];


                for (const [filterValue, predicate] of filterRules) {
                    if (filterValue?.length) {
                        children = children.filter(predicate);
                    }
                }

                if (missingAttrsOnly) {
                    children = children.filter(c => c.model?.model_title);
                }

                if (missingFeatureOnly) {
                    children = children.filter(
                        c => !c.model?.model_title
                    );
                }

                if (!children.length) return null;

                return {...group, children};
            })
            .filter(Boolean);
    };


    const missingFeatureTotal = rows.filter(c => !c.model?.model_title).length;


    const missingAttrsTotal = rows.filter(
        c => !c.attributes?.attr_value_ids?.length
    ).length;


    const toggleMissingModelFilter = () => {
        setMissingModelFilterActive(prev => !prev);
    };

    const toggleMissingAttrsFilter = () => {
        setMissingAttrsFilterActive(prev => !prev);
    };


    const handleTableChange = (_, filters) => {
        setFiltersState(filters);
    };

    const modelColumnTitle = (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
        }}>
            <span>Модель</span>

            <div
                style={{
                    width: 28,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {missingModelFilterActive ? (
                    <QuestionOutlined
                        style={{
                            fontSize: 16,
                            color: "#ff4d4f",
                            cursor: "pointer"
                        }}
                        onClick={toggleMissingModelFilter}
                    />
                ) : (
                    missingFeatureTotal > 0 && (
                        <Badge
                            count={missingFeatureTotal}
                            style={{
                                backgroundColor: "#ff4d4f",
                                cursor: "pointer"
                            }}
                            onClick={toggleMissingModelFilter}
                        />
                    )
                )}
            </div>
        </div>
    );

    const attrsColumnTitle = (
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <span>Атрибуты</span>

            <div
                style={{
                    width: 28,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {missingAttrsFilterActive ? (
                    <LinkOutlined
                        style={{
                            fontSize: 16,
                            color: "#ff4d4f",
                            cursor: "pointer"
                        }}
                        onClick={toggleMissingAttrsFilter}
                    />
                ) : (
                    missingAttrsTotal > 0 && (
                        <Badge
                            count={missingAttrsTotal}
                            style={{
                                backgroundColor: "#ff4d4f",
                                cursor: "pointer"
                            }}
                            onClick={toggleMissingAttrsFilter}
                        />
                    )
                )}
            </div>
        </div>
    );

    const handleAddDependenceMulti = (selectedKeys) => {
        if (!selectedKeys.length) return;

        const selectedRecords = rows.filter(r => selectedKeys.includes(r.key));
        const originList = selectedRecords.map(r => r.origin);
        const titleList = selectedRecords.map(r => String(r.title ?? "??"));

        setDependencySelection({
            origin: originList,
            titles: titleList,
            record: {title: titleList.join(", ")},
            setRows
        });
    };


    return (
        <Modal open={isOpen} onCancel={onClose} width={1280} footer={null}>
            {selectedRowKeys.length > 0 && (
                <Button className="fixed-button fixed-button-dependency"
                        onClick={() => handleAddDependenceMulti(selectedRowKeys)}>
                    Зависимость ({selectedRowKeys.length}) <ShareAltOutlined/>
                </Button>
            )}

            {!!dependencySelection && (
                <InfoSelect
                    titles={dependencySelection.titles}
                    origin={dependencySelection.origin}
                    record={dependencySelection.record}
                    setRows={setRows}
                    onClose={() => setDependencySelection(null)}
                    autoOpen
                />
            )}

            {!!attributesModalData && (
                <AttributesModal
                    open={true}
                    data={attributesModalData}
                    onClose={() => setAttributesModalData(null)}

                    onSaved={(patch) => {
                        const normalizedPatch = {
                            title: patch.title,
                            attributes: {
                                attr_value_ids: patch.attributes ?? []
                            },
                            have_attributes: (patch.attributes?.length ?? 0) > 0
                        };

                        updateRow(patch.origin, normalizedPatch);
                        setAttributesModalData(null);
                    }}


                    onUploaded={(patch) => {
                        updateRow(attributesModalData.origin, patch);
                    }}
                />
            )}


            <div style={{marginTop: 20}}>
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                        getCheckboxProps: record => ({
                            disabled: !!record.children
                        })
                    }}
                    columns={
                        getUnidentifiedOriginsColumns(
                            filters,
                            filtersState,
                            modelColumnTitle,
                            attrsColumnTitle,
                            setAttributesModalData,
                            missingAttrsFilterActive
                        )}
                    dataSource={data}
                    loading={loading}
                    size="small"
                    pagination={false}
                    rowKey="key"
                    onChange={handleTableChange}
                    expandable={{
                        expandedRowKeys,
                        onExpandedRowsChange: setExpandedRowKeys,
                        expandIcon: () => null
                    }}
                />

            </div>
        </Modal>
    );
};

export default UnidentifiedOriginsComponent;