import {useEffect, useState} from "react";
import {Modal, Table} from "antd";
import {fetchPostData} from "../SchemeAttributes/api.js";
import {getUnidentifiedOriginsColumns} from "./unidentifiedOriginsColumns.jsx";

const UnidentifiedOriginsComponent = ({
                                          comparisonObj: {vsl_list, path_ids},
                                          isOpen,
                                          onClose
                                      }) => {
    const [loading, setLoading] = useState(false);
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [filtersState, setFiltersState] = useState({});
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [filters, setFilters] = useState({features: [], types: [], brands: []});

    const groupByVsl = (origins, vslList) => {
        return vslList
            .map(vsl => {
                const children = origins.filter(o => o.vsl_id === vsl.id);

                if (!children.length) return null;

                return {
                    key: `vsl-${vsl.id}`,
                    vsl_id: vsl.id,
                    vsl_title: vsl.title,
                    children
                };
            })
            .filter(Boolean);
    };

    const applyFilters = (data, filters) => {
        const noFilters = Object.values(filters).every(
            v => !v || v.length === 0
        );

        if (noFilters) return data;

        return data
            .map(group => {
                let children = [...group.children];

                if (filters.feature?.length) {
                    children = children.filter(c =>
                        filters.feature.includes(c.feature)
                    );
                }

                if (filters.type_?.length) {
                    children = children.filter(c =>
                        filters.type_.includes(c.type_?.type)
                    );
                }

                if (filters.brand?.length) {
                    children = children.filter(c =>
                        filters.brand.includes(c.brand?.brand)
                    );
                }

                if (filters.have_images?.length) {
                    children = children.filter(c =>
                        filters.have_images.includes(c.have_images)
                    );
                }

                if (filters.model_in_hub?.length) {
                    children = children.filter(c =>
                        filters.model_in_hub.includes(c.model_in_hub)
                    );
                }

                if (!children.length) return null;

                return {
                    ...group,
                    children
                };
            })
            .filter(Boolean);
    };

    useEffect(() => {
        if (!isOpen) return;

        const loadData = async () => {
            setLoading(true);

            const payload = {vsl_list, path_ids};
            const response = await fetchPostData(
                "/service/fetch_unidentified_origins",
                payload
            );

            if (response?.origins) {
                const origins = response.origins;
                const grouped = groupByVsl(origins, vsl_list);

                setOriginalData(grouped);
                setData(grouped);

                setExpandedRowKeys(grouped.map(g => g.key));

                const featureSet = new Set();
                const typeSet = new Set();
                const brandSet = new Set();

                for (const item of origins) {
                    if (item.feature) featureSet.add(item.feature);
                    if (item.type_?.type) typeSet.add(item.type_.type);
                    if (item.brand?.brand) brandSet.add(item.brand.brand);
                }

                setFilters({
                    features: [...featureSet].map(v => ({text: v, value: v})),
                    types: [...typeSet].map(v => ({text: v, value: v})),
                    brands: [...brandSet].map(v => ({text: v, value: v}))
                });
            }

            setLoading(false);
        };

        void loadData();
    }, [isOpen, vsl_list, path_ids]);

    useEffect(() => {
        setExpandedRowKeys(data.map(g => g.key));
    }, [data]);

    const handleTableChange = (_, filters) => {
        setFiltersState(filters);
        const filtered = applyFilters(originalData, filters);
        setData(filtered);
    };


    return (
        <Modal open={isOpen} onCancel={onClose} width={1280} footer={null}>
            <div style={{marginTop: 20}}>
                <Table
                    columns={getUnidentifiedOriginsColumns(filters, filtersState)}
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