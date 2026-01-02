import {useEffect, useState} from "react";
import {Button, Modal, Select, Table} from "antd";
import {fetchDeleteData, fetchGetData, fetchPostData} from "./api.js";
import {EllipsisOutlined, LoadingOutlined} from "@ant-design/icons";

const TabModelsDependencies = () => {
    const [types, setTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [models, setModels] = useState([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scheme, setScheme] = useState(null);
    const [selectedValues, setSelectedValues] = useState({});



    useEffect(() => {
        fetchGetData("/service/attributes/get_all_types").then(setTypes);
    }, []);

    const loadModels = async (type_id, brand_ids) => {
        const payload = {
            type_id,
            brand_ids: brand_ids.length > 0 ? brand_ids : null
        };

        const res = await fetchPostData("/service/attributes/product_global_list", payload);
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

    const showSelectedInfo = async () => {
        const selectedRows = models.filter(m => selectedRowKeys.includes(m.id));
        const uniqueBrands = new Set(selectedRows.map(r => r.brand_id));

        if (uniqueBrands.size > 1) {
            Modal.warning({title: "Ошибка выбранных элементов", content: "Выберите модели одного бренда"});
            return;
        }

        const brand_id = selectedRows[0].brand_id;

        const payload = {
            product_type_id: selectedTypeId,
            brand_id
        };

        const schemeData = await fetchPostData("/service/attributes/product_dependencies_scheme", payload);

        setScheme(schemeData);
        setIsModalOpen(true);
    };


    const handleValueChange = async (keyId, newValues) => {
        const oldValues = selectedValues[keyId] || [];

        const added = newValues.filter(v => !oldValues.includes(v));
        const removed = oldValues.filter(v => !newValues.includes(v));

        setSelectedValues(prev => ({
            ...prev,
            [keyId]: newValues
        }));

        if (added.length > 0) {
            await fetchPostData("/service/attributes/add_product_attribute_value_option_link", {
                model_ids: selectedRowKeys,
                attribute_value_id: added[0]
            });
        }

        if (removed.length > 0) {
            await fetchPostData("/service/attributes/delete_product_attribute_value_option_link", {
                model_ids: selectedRowKeys,
                attribute_value_id: removed[0]
            });
        }
    };



    return (
        <div style={{padding: 12, display: "flex", flexDirection: "column", gap: 16}}>
            <div style={{fontWeight: 500}}>Тип продукта</div>

            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <Select
                    style={{width: 300}}
                    placeholder="Тип продукта"
                    value={selectedTypeId}
                    onChange={handleTypeChange}
                    options={types.map((t) => ({label: t.type, value: t.id}))}
                />

                {selectedRowKeys.length > 0 && (
                    <Button style={{padding: "4px 12px", cursor: "default"}}
                            onClick={showSelectedInfo}>Связать атрибуты
                    </Button>
                )}
            </div>

            {models.length > 0 && (
                <Table
                    dataSource={models}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    style={{width: 600}}
                    rowSelection={rowSelection}
                />
            )}
            <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={600}>
                <div style={{display: "flex", flexDirection: "column", gap: 16}}>

                    {selectedRowKeys.length > 0 && (
                        <div >
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                                {models
                                    .filter(m => selectedRowKeys.includes(m.id))
                                    .map(m => (
                                        <div key={m.id} style={{fontSize: 13}}>
                                            <LoadingOutlined /> {m.title}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Список ключей */}
                    {scheme && scheme.keys.map(key => (
                        <div key={key.key_id} style={{display: "flex", flexDirection: "column", gap: 6}}>
                            <div style={{fontWeight: 500}}>{key.key}</div>

                            <Select
                                mode="multiple"
                                placeholder={`Выберите значения для ${key.key}`}
                                value={selectedValues[key.key_id] || []}
                                onChange={(vals) => handleValueChange(key.key_id, vals)}
                                options={key.values.map(v => ({
                                    label: v.value,
                                    value: v.id
                                }))}
                            />
                        </div>
                    ))}
                </div>
            </Modal>




        </div>
    );

};


export default TabModelsDependencies;
