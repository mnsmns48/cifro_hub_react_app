import {useEffect, useState} from "react";
import {Button, Modal, Table} from "antd";
import {fetchGetData, fetchPostData} from "./SchemeAttributes/api.js";
import {featuresColumns} from "./FeaturesGlobal/featuresColumns.jsx";
import './FeaturesGlobal/FeaturesGlobal.css'

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [routes, setRoutes] = useState([]);


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
        setIsModalOpen(true);
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

        setIsModalOpen(false);
        setSelectedRowKeys([]);
    };


    const noLevelCount = data.filter(item => !item.hub_level).length;

    const filteredData = filterData(
        onlyNoLevel ? data.filter(item => !item.hub_level) : data,
        search
    );

    const {typeFilters, brandFilters} = buildFilters(data);
    const rowSelection = {selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys),};

    const columns = featuresColumns(
        typeFilters,
        brandFilters,
        search,
        setSearch,
        noLevelCount,
        onlyNoLevel,
        setOnlyNoLevel
    );

    return (
        <>
            {selectedRowKeys.length > 0 && (
                <div style={{marginBottom: 12}}>
                    <Button type="primary" onClick={openHubPathModal}>
                        Установить папку выгрузки Hub Path
                    </Button>
                </div>
            )}

            <Table rowKey="id"
                   columns={columns}
                   dataSource={filteredData}
                   rowSelection={rowSelection}
                   pagination={false}
                   size={"small"}
                   rowClassName={(record) => (!record.hub_level ? "no-level-row" : "")}
            />
            <Modal
                width={450}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                {routes.map((routeObj, idx) => {
                    const steps = routeObj.rotes.slice(1);
                    const pretty = steps.map(s => s.label).join(" → ");

                    const last = routeObj.rotes.at(-1);
                    const hubLevel = last.path_id;
                    const label = last.label;

                    return (
                        <Button key={idx}
                                type="default"
                                style={{
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
        </>
    );
};

export default FeaturesGlobal;
