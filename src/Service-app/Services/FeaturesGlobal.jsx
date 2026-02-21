import {useEffect, useState} from "react";
import {Table} from "antd";
import {fetchGetData} from "./SchemeAttributes/api.js";
import {featuresColumns} from "./FeaturesGlobal/featuresColumns.jsx";


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


    useEffect(() => {
        async function load() {
            const response = await fetchGetData("service/features/features_hub_level_link_fetch");
            setData(response.features || []);
        }

        void load();
    }, []);


    const noLevelCount = data.filter(item => !item.hub_level).length;
    const filteredData = filterData(data, search);
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
        <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            rowSelection={rowSelection}
            pagination={false}
            size={"small"}
        />
    );
};

export default FeaturesGlobal;
