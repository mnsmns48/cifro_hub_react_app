import {useEffect, useState} from "react";
import {fetchGetData} from "./api.js";
import {Badge, Button, Input, Modal, Select, Table} from "antd";
import {
    ClearOutlined,
    DisconnectOutlined,
    HolderOutlined,
    LinkOutlined,
    MoreOutlined
} from "@ant-design/icons";
import ModelAttributesModal from "./ModelAttributesModal.jsx";


const TabModelsDependencies = () => {
    const [types, setTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [models, setModels] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);


    useEffect(() => {
        fetchGetData("/service/attributes/get_all_types").then(setTypes);
    }, []);


    const loadModels = async (id) => {
        const res = await fetchGetData(
            `/service/attributes/load_model_attribute_options/${id}`);
        setModels(res);
        setSelectedBrand(null);
    };

    const refreshModels = async () => {
        if (selectedTypeId) {
            await loadModels(selectedTypeId);
        }
    };


    const handleOptionOpen = async (record) => {
        const payload = {
            titles: [record.title],
            model_ids: [record.model_id],
            product_type_id: selectedTypeId,
            brand_id: record.brand_id,
            model_attribute_values: record.model_attribute_values
        };

        const res = await fetch("/service/attributes/model_attributes_request", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        setModalData(data);
        setModalOpen(true);
    };

    const handleBulkOpen = async () => {
        const selectedRows = models.filter(m => selectedRowKeys.includes(m.model_id));

        if (selectedRows.length === 0) {
            return;
        }

        const uniqueBrands = new Set(selectedRows.map(r => r.brand_id));
        if (uniqueBrands.size > 1) {
            Modal.warning({
                title: "Ошибка выбранных элементов",
                content: "Выберите модели одного бренда"
            });
            return;
        }

        const normalize = (m) => {
            const map = {};
            m.model_attribute_values.forEach(k => {
                map[k.key_id] = k.attr_value_ids.map(v => v.id).sort();
            });
            return map;
        };

        const base = normalize(selectedRows[0]);
        const baseKeys = Object.keys(base).sort();

        for (let i = 1; i < selectedRows.length; i++) {
            const current = normalize(selectedRows[i]);
            const currentKeys = Object.keys(current).sort();

            if (baseKeys.length !== currentKeys.length ||
                baseKeys.some((k, idx) => k !== currentKeys[idx])) {
                Modal.warning({
                    title: "Несовпадающие ключи атрибутов",
                    content: "Выбранные модели имеют разный набор ключей атрибутов"
                });
                return;
            }

            for (const keyId of baseKeys) {
                const a = base[keyId];
                const b = current[keyId];

                if (a.length !== b.length || a.some((v, idx) => v !== b[idx])) {
                    Modal.warning({
                        title: "Несовпадающие значения",
                        content: "Выбранные модели имеют разные значения атрибутов"
                    });
                    return;
                }
            }
        }

        const brand_id = [...uniqueBrands][0];

        const payload = {
            titles: selectedRows.map(r => r.title),
            model_ids: selectedRows.map(r => r.model_id),
            product_type_id: selectedTypeId,
            brand_id: brand_id,
            model_attribute_values: selectedRows[0].model_attribute_values
        };

        const res = await fetch("/service/attributes/model_attributes_request", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        setModalData(data);
        setModalOpen(true);
    };

    const handleTypeChange = async (id) => {
        setSelectedTypeId(id);
        await loadModels(id);
    };

    const filteredModels = models.filter(m => {
        const text = searchText.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(text);
        const matchesBrand = selectedBrand ? m.brand === selectedBrand : true;
        const matchesEmpty = showOnlyEmpty ? m.model_attribute_values.length === 0 : true;
        return matchesTitle && matchesBrand && matchesEmpty;
    });

    const emptyCount = models.filter(m => m.model_attribute_values.length === 0).length;

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys)
    };

    const uniqueBrands = [...new Set(models.map(m => m.brand))];

    const titleHeader = (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Input size="middle"
                   placeholder="Поиск"
                   value={searchText}
                   onChange={(e) => {
                       setSearchText(e.target.value);
                       setSelectedRowKeys([]);
                   }}
                   suffix={
                       searchText && (
                           <ClearOutlined
                               onClick={() => {
                                   setSearchText("");
                                   setSelectedRowKeys([]);
                               }}
                               style={{color: "#999"}}
                           />
                       )
                   }
            />
        </div>
    )

    const brandHeader = (
        <Select allowClear
                placeholder="Бренд"
                style={{width: 140}}
                value={selectedBrand}
                onChange={(value) => {
                    setSelectedBrand(value || null);
                    setSelectedRowKeys([])
                }}
                options={uniqueBrands.map(b => ({label: b, value: b}))}
        />
    )

    const attributeHeader = (
        <div style={{display: "flex", gap: 6}}>
            <Badge count={emptyCount} size="small" style={{marginRight: "15px"}}>
                <Button
                    type={showOnlyEmpty ? "primary" : "default"}
                    onClick={() => setShowOnlyEmpty(true)}
                ><DisconnectOutlined/></Button>
            </Badge>

            <Button onClick={() => setShowOnlyEmpty(false)}
                    type={!showOnlyEmpty ? "primary" : "default"}
            ><MoreOutlined/></Button>
        </div>
    );


    const columns = [
        {title: titleHeader, dataIndex: "title", width: 300, key: "title"},
        {title: brandHeader, dataIndex: "brand", width: 80, key: "brand", align: "center"},
        {
            title: attributeHeader,
            width: 100,
            key: "attributes",
            align: "center",
            render: (_, record) => {
                const hasAttrs = record.model_attribute_values?.length > 0;

                if (!hasAttrs) {
                    return (
                        <Button
                            onClick={() => handleOptionOpen(record)}
                            icon={<HolderOutlined/>}
                        />
                    );
                }

                const keys = record.model_attribute_values.map(k => k.key);

                return (
                    <Button onClick={() => handleOptionOpen(record)}
                            style={{
                                display: "flex", flexDirection: "row",
                                alignItems: "center", justifyContent: "flex-start",
                                gap: 6, height: "auto", lineHeight: 1, width: "100%"
                            }}
                    >
                        <div style={{display: "flex", fontSize: "17px", alignItems: "center", whiteSpace: "nowrap"}}>
                            {record.model_attribute_values.length}
                        </div>

                        <div style={{
                            fontSize: "9px", opacity: 0.7, display: "flex", flexDirection: "column",
                            textAlign: "left", overflow: "hidden"
                        }}
                        >
                            {keys.map((k, i) => (
                                <span key={i}>{k}</span>
                            ))}
                        </div>
                    </Button>
                );
            }
        }
    ];

    return (
        <div style={{padding: 12, display: "flex", flexDirection: "column", gap: 16}}>
            <div style={{fontWeight: 500}}>Тип продукта</div>

            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <Select style={{width: 200}}
                        placeholder="Тип продукта"
                        value={selectedTypeId} onChange={handleTypeChange}
                        options={types.map((t) => ({label: t.type, value: t.id}))}
                />
                {selectedRowKeys.length > 0 && (
                    <Button style={{padding: "4px 12px"}} onClick={handleBulkOpen}><LinkOutlined/> атрибуты</Button>
                )}
            </div>
            {models.length > 0 && (
                <Table dataSource={filteredModels}
                       columns={columns} rowKey="model_id"
                       pagination={false} size="small"
                       style={{width: 650}} rowSelection={rowSelection}/>
            )}
            <ModelAttributesModal
                open={modalOpen} onClose={() => setModalOpen(false)} data={modalData} onUpdated={refreshModels}/>
        </div>
    )

}

export default TabModelsDependencies;