import {useEffect, useState} from "react";
import {Select, Table} from "antd";
import {fetchGetData, fetchPostData} from "./api.js";

const TabModelsDependencies = () => {
    const [types, setTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        fetchGetData("/service/attributes/get_all_types").then(setTypes);
    }, []);

    const loadModels = async (type_id, brand_ids) => {
        const payload = {
            type_id,
            brand_ids: brand_ids.length > 0 ? brand_ids : null
        };

        const res = await fetchPostData("/service/attributes/get_product_global_list", payload);
        setModels(res);
    };

    const handleTypeChange = async (id) => {
        setSelectedTypeId(id);
        setSelectedBrandIds([]);
        await loadModels(id, []);
    };


    const uniqueBrands = [...new Set(models.map(m => m.brand_id))].map(id => {
        const item = models.find(m => m.brand_id === id);
        return {id, brand: item.brand};
    });


    const brandFilterHeader = (
        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
            <Select
                allowClear
                placeholder="Все бренды"
                style={{width: 150}}
                value={selectedBrandIds.length === 1 ? selectedBrandIds[0] : null}
                onChange={(value) => {
                    const newIds = value ? [value] : [];
                    setSelectedBrandIds(newIds);
                    void loadModels(selectedTypeId, newIds);
                }}
                options={uniqueBrands.map(b => ({
                    label: b.brand,
                    value: b.id
                }))}
            />
        </div>
    );


    const columns = [
        {dataIndex: "title", key: "title"},
        {title: brandFilterHeader, dataIndex: "brand", key: "brand", width: 150, align: "center"},
    ];

    const rowSelection = {
        selectedRowKeys, onChange: (keys) => {
            setSelectedRowKeys(keys);
        }
    };

    return (
        <div style={{padding: 12, display: "flex", flexDirection: "column", gap: 16}}>
            <div style={{fontWeight: 500}}>Тип продукта</div>

            <Select
                style={{width: 300}}
                placeholder="Тип продукта"
                value={selectedTypeId}
                onChange={handleTypeChange}
                options={types.map((t) => ({label: t.type, value: t.id}))}
            />

            {models.length > 0 && (
                <Table dataSource={models}
                       columns={columns}
                       rowKey="id"
                       pagination={false}
                       size="small"
                       style={{width: 600}}
                       rowSelection={rowSelection}
                />
            )}
        </div>
    );
};


export default TabModelsDependencies;
