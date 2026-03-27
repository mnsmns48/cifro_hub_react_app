import {useEffect, useState} from "react";
import {Button, Modal, Popconfirm, Table} from "antd";
import {fetchGetData, fetchPostData} from "./SchemeAttributes/api.js";
import {featuresColumns} from "./FeaturesGlobal/FeaturesColumns.jsx";
import './FeaturesGlobal/FeaturesGlobal.css'
import FeaturesComponent from "./FeaturesGlobal/FeaturesComponent.jsx";
import axios from "axios";
import FeaturesAddNew from "./FeaturesGlobal/FeaturesAddNew.jsx";

const buildFilters = (data) => {
    const typeSet = new Map();
    const brandSet = new Map();

    data.forEach(item => {
        typeSet.set(item.type.id, item.type.type);
        brandSet.set(item.brand.id, item.brand.brand);
    });

    return {
        typeFilters: Array.from(typeSet, ([value, text]) => ({text, value})),
        brandFilters: Array.from(brandSet, ([value, text]) => ({text, value})),
    };
}

const filterData = (data, search) => {
    if (!search) return data;

    const s = search.toLowerCase();

    return data.filter(item =>
        item.title.toLowerCase().includes(s)
    );
}


const FeaturesGlobal = () => {
    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [search, setSearch] = useState("");
    const [onlyNoLevel, setOnlyNoLevel] = useState(false);
    const [isHubLevelModalOpen, setIsHubLevelModalOpen] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [featureData, setFeatureData] = useState(null);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [isNewFeaturesProductModalOpen, setIsNewFeaturesProductModalOpen] = useState(false);


    useEffect(() => {
        async function load() {
            const response = await fetchGetData("service/features/features_hub_level_link_fetch");
            setData(response.features || []);
        }

        void load();
    }, []);

    const openHubPathModal = async () => {
        const response = await fetchGetData("service/features/hub_level_routes");
        setRoutes(response.routes || []);
        setIsHubLevelModalOpen(true);
    };


    const applyRouteToSelected = async (hubLevel, label) => {
        const payload = {
            feature_ids: selectedRowKeys,
            hub_level_id: hubLevel,
            label: label
        };

        const response = await fetchPostData(
            "service/features/set_level_routes",
            payload
        );

        if (!response || !response.updated) return;

        setData(prev =>
            prev.map(item =>
                response.updated[item.id]
                    ? {
                        ...item,
                        hub_level: {
                            path_id: response.updated[item.id].path_id,
                            label: response.updated[item.id].label
                        }
                    }
                    : item
            )
        );

        setIsHubLevelModalOpen(false);
        setSelectedRowKeys([]);
    };


    const noLevelCount = data.filter(item => !item.hub_level).length;

    const filteredData = filterData(
        onlyNoLevel ? data.filter(item => !item.hub_level) : data,
        search
    );

    const {typeFilters, brandFilters} = buildFilters(data);
    const rowSelection = {selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys),};

    const descriptionClick = async (record) => {
        const response = await fetchGetData(`service/features/get_features_by_feature_id/${record.id}`);
        setFeatureData(response);
        setIsFeatureModalOpen(true);
    };


    const deleteFeatures = async () => {
        try {
            const response = await axios.post(
                "/service/features/delete_features",
                {
                    feature_ids: selectedRowKeys
                }
            );

            if (!response.data || !response.data.ids) return;

            setData(prev =>
                prev.filter(item => !response.data.ids.includes(item.id))
            );

            setSelectedRowKeys([]);
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    const newFeaturesProductClick = () => {
        setIsNewFeaturesProductModalOpen(true)
    }

    const handleFeatureCreated = async (newFeature) => {
        setData(prev => [...prev, newFeature]);
        const full = await fetchGetData(`service/features/get_features_by_feature_id/${newFeature.id}`);
        setFeatureData(full);
        setIsFeatureModalOpen(true);
    };


    const columns = featuresColumns(
        typeFilters,
        brandFilters,
        search,
        setSearch,
        noLevelCount,
        onlyNoLevel,
        setOnlyNoLevel,
        descriptionClick
    );

    return (
        <>
            {selectedRowKeys.length === 0 && (
                <Button size="small" style={{marginBottom: 12, display: "flex", gap: 8}} type="primary"
                        onClick={newFeaturesProductClick}>Новый
                    продукт</Button>)
            }
            {selectedRowKeys.length > 0 && (
                <div style={{marginBottom: 12, display: "flex", gap: 8}}>
                    <Button type="primary" onClick={openHubPathModal} size="small">
                        Установить папку выгрузки Hub Path
                    </Button>

                    <Popconfirm
                        title="Удалить зависимость?"
                        description="Это действие необратимо и может повлиять на структуру данных.
                        Сломается атрибутика, связи с папкой хабом. Перед тем как удалить, подумай ещё 10 раз!"
                        okText="Удалить"
                        cancelText="Отмена"
                        okButtonProps={{danger: true}}
                        onConfirm={deleteFeatures}
                    >
                        <Button danger size="small">
                            Удалить зависимость
                        </Button>
                    </Popconfirm>

                </div>
            )}


            <Table rowKey="id"
                   className="compact-table"
                   columns={columns}
                   dataSource={filteredData}
                   rowSelection={rowSelection}
                   pagination={false}
                   size={"small"}
                   rowClassName={(record) => (!record.hub_level ? "no-level-row" : "")}
            />
            <Modal width={450}
                   open={isHubLevelModalOpen}
                   onCancel={() => setIsHubLevelModalOpen(false)}
                   footer={null}>
                {routes.map((routeObj, idx) => {
                    const steps = routeObj.rotes.slice(1);
                    const pretty = steps.map(s => s.label).join(" → ");
                    const last = routeObj.rotes.at(-1);
                    const hubLevel = last.path_id;
                    const label = last.label;
                    return (
                        <Button key={idx} type="default" style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                            textAlign: "left",
                            marginBottom: 8
                        }}
                                onClick={() => applyRouteToSelected(hubLevel, label)}
                        >
                            {pretty}
                        </Button>
                    );
                })}
            </Modal>

            <FeaturesAddNew
                open={isNewFeaturesProductModalOpen}
                onClose={() => setIsNewFeaturesProductModalOpen(false)}
                onCreated={handleFeatureCreated}
            />

            <FeaturesComponent
                open={isFeatureModalOpen} onClose={() => setIsFeatureModalOpen(false)} data={featureData}/>
        </>
    );
};

export default FeaturesGlobal;
