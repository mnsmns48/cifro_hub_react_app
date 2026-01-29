import {useEffect, useState} from "react";
import {Select, Table, Button} from "antd";
import {fetchGetData, fetchPostData, fetchDeleteData} from "./api.js";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";

const TabTypesDependencies = () => {
    const [loading, setLoading] = useState(false);


    const [types, setTypes] = useState([]);
    const [keys, setKeys] = useState([]);
    const [brands, setBrands] = useState([]);

    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [selectedAttrKeys, setSelectedAttrKeys] = useState([]);

    const [ruleBrandId, setRuleBrandId] = useState(null);
    const [ruleType, setRuleType] = useState(null);
    const [ruleKey, setRuleKey] = useState(null);

    useEffect(() => {
        fetchGetData("/service/attributes/get_types_dependencies").then((res) => {
            setTypes(res.types_map);
            setKeys(res.keys);
            setBrands(res.brands);
        });
    }, []);

    const selectedType = types.find((t) => t.id === selectedTypeId);

    const allKeyOptions = keys.map((k) => ({ label: k.key, value: k.key }));

    const handleTypeChange = (id) => {
        setSelectedTypeId(id);
        setLoading(true);

        const type = types.find((t) => t.id === id);
        if (type) {
            const baseKeys = type.attr_link.map((l) => l.attr_key.key);
            setSelectedAttrKeys(baseKeys);
        }
        setLoading(false);
    };

    const handleKeysChange = async (newKeys) => {
        const oldKeys = selectedAttrKeys;
        const added = newKeys.filter((k) => !oldKeys.includes(k));
        const removed = oldKeys.filter((k) => !newKeys.includes(k));

        setSelectedAttrKeys(newKeys);

        for (const key of added) {
            const keyObj = keys.find((k) => k.key === key);
            if (!keyObj) continue;

            await fetchPostData("/service/attributes/add_types_dependencies",
                { type_id: selectedTypeId, attr_key_id: keyObj.id });
        }

        for (const key of removed) {
            const keyObj = keys.find((k) => k.key === key);
            if (!keyObj) continue;

            await fetchDeleteData(
                `/service/attributes/delete_types_dependencies?type_id=${selectedTypeId}&attr_key_id=${keyObj.id}`
            );
        }
    };

    const ruleKeyOptions = (() => {
        if (!ruleType) return [];

        if (ruleType === "exclude") {
            return selectedAttrKeys.map((k) => ({label: k, value: k}));
        }

        if (ruleType === "include") {
            return keys
                .filter((k) => !selectedAttrKeys.includes(k.key))
                .map((k) => ({label: k.key, value: k.key}));
        }

        return [];
    })();

    const handleAddRule = async () => {
        if (!ruleBrandId || !ruleType || !ruleKey) return;

        const brandObj = brands.find((b) => b.id === ruleBrandId);
        const keyObj = keys.find((k) => k.key === ruleKey);

        const payload = {
            product_type_id: selectedTypeId, brand_id: brandObj.id, attr_key_id: keyObj.id, rule_type: ruleType,
        };

        const created = await fetchPostData(
            "/service/attributes/add_attribute_brand_link",
            payload
        );

        const updatedTypes = types.map((t) =>
            t.id === selectedTypeId
                ? {
                    ...t,
                    rule_overrides: [
                        ...t.rule_overrides,
                        {
                            ...created,
                            brand: brandObj,
                            attr_key: keyObj,
                        },
                    ],
                }
                : t
        );

        setTypes(updatedTypes);

        setRuleBrandId(null);
        setRuleType(null);
        setRuleKey(null);
    };


    const handleDeleteRule = async (rule) => {
        const params = new URLSearchParams({
            product_type_id: String(selectedTypeId),
            brand_id: String(rule.brand_id),
            attr_key_id: String(rule.attr_key_id),
            rule_type: rule.rule_type,
        });

        await fetchDeleteData(
            `/service/attributes/delete_attribute_brand_link?${params.toString()}`
        );

        const updatedTypes = types.map((t) =>
            t.id === selectedTypeId
                ? {
                    ...t,
                    rule_overrides: t.rule_overrides.filter(
                        (r) =>
                            !(
                                r.brand_id === rule.brand_id &&
                                r.attr_key_id === rule.attr_key_id &&
                                r.rule_type === rule.rule_type
                            )
                    ),
                }
                : t
        );

        setTypes(updatedTypes);
    };


    const columns = [
        {
            title: "Бренд",
            dataIndex: ["brand", "brand"],
            key: "brand",
        },
        {
            title: "Ключ",
            dataIndex: ["attr_key", "key"],
            key: "key",
        },
        {
            title: "Правило",
            dataIndex: "rule_type",
            key: "rule_type",
            render: (value) =>
                value === "include"
                    ? <span style={{color: "green"}}>Добавляет</span>
                    : <span style={{color: "red"}}>Исключает</span>,
        },
        {
            key: "delete",
            render: (_, row) => (<div style={{display: 'flex', justifyContent: 'center', cursor: 'pointer'}}
                                      onClick={() => handleDeleteRule(row)}><CloseOutlined/></div>),
        },
    ];

    return (
        <div style={{padding: 12, display: "flex", flexDirection: "column", gap: 16}}>

            <div style={{fontWeight: 500}}>Тип продукта</div>

            <Select
                style={{width: 300}}
                placeholder="Выберите тип"
                value={selectedTypeId}
                onChange={handleTypeChange}
                options={types.map((t) => ({
                    label: t.type,
                    value: t.id,
                }))}
            />

            {selectedType && (
                loading ? (
                    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <Select
                            mode="multiple"
                            style={{ width: 400 }}
                            placeholder="Ключи"
                            value={selectedAttrKeys}
                            onChange={handleKeysChange}
                            options={allKeyOptions}
                        />

                        {selectedAttrKeys.length > 0 && (
                            <div style={{ display: "flex", gap: 12 }}>
                                <Select
                                    style={{ width: 150 }}
                                    placeholder="Бренд"
                                    value={ruleBrandId}
                                    onChange={setRuleBrandId}
                                    options={brands.map((b) => ({
                                        label: b.brand,
                                        value: b.id,
                                    }))}
                                />

                                <Select
                                    style={{ width: 150 }}
                                    placeholder="Правило"
                                    value={ruleType}
                                    onChange={setRuleType}
                                    options={[
                                        { label: "Добавляет", value: "include" },
                                        { label: "Исключает", value: "exclude" },
                                    ]}
                                />

                                <Select
                                    style={{ width: 150 }}
                                    placeholder="Ключ"
                                    value={ruleKey}
                                    onChange={setRuleKey}
                                    options={ruleKeyOptions}
                                />

                                <Button onClick={handleAddRule} icon={<PlusOutlined />} />
                            </div>
                        )}

                        {selectedType.rule_overrides.length > 0 && (
                            <Table
                                dataSource={selectedType.rule_overrides}
                                columns={columns}
                                rowKey={(row) =>
                                    `${row.brand_id}-${row.attr_key_id}-${row.rule_type}`
                                }
                                pagination={false}
                                size="small"
                                style={{ width: 500 }}
                            />
                        )}
                    </>
                )
            )}

        </div>
    );
};

export default TabTypesDependencies;
