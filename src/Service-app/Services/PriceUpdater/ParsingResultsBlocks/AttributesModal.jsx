import {useEffect, useState, useCallback} from "react";
import {fetchGetData, fetchPostData} from "../../SchemeAttributes/api.js";
import {Button, Col, Modal, Radio, Row, Select, message, Input} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import AttributesImageContainer from "./AttributeImageConteiner.jsx";

const AttributesModal = ({open, data, onClose, onSaved, onUploaded}) => {
    const [loading, setLoading] = useState(false);
    const [allowable, setAllowable] = useState([]);
    const [exists, setExists] = useState([]);
    const [formulas, setFormulas] = useState([]);
    const [selectedFormula, setSelectedFormula] = useState(null);
    const [generatedName, setGeneratedName] = useState("");

    const loadAttributes = useCallback(async () => {
        if (!data) return;

        setLoading(true);

        const result = await fetchPostData("service/attributes/attributes_origin_value_check_request", {
            origin: data.origin, model_id: data.model_id, title: data.title
        });

        setAllowable(result?.attributes_allowable ?? []);
        setExists(result?.attributes_exists ?? []);
        setLoading(false);
    }, [data]);


    const loadFormulas = useCallback(async () => {
        const result = await fetchGetData("/service/formula-expression/");
        setFormulas(result ?? []);

        const defaultFormula = result?.find(f => f.is_default);
        if (defaultFormula) {
            setSelectedFormula(defaultFormula.id);
        }
    }, []);


    useEffect(() => {
        if (!open || allowable.length === 0) return;

        setExists(prev => {
            const updated = [...prev];

            allowable.forEach(attr => {
                if (attr.attr_value_ids.length === 1) {
                    const single = attr.attr_value_ids[0];
                    const existsForKey = updated.find(e => e.key_id === attr.key_id);

                    if (!existsForKey) {
                        updated.push({
                            key_id: attr.key_id, key: attr.key, attr_value_ids: [single]
                        });
                    }
                }
            });

            return updated;
        });
    }, [allowable, open]);

    useEffect(() => {
        if (!open) {
            setAllowable([]);
            setExists([]);
            setFormulas([]);
            setSelectedFormula(null);
            setGeneratedName("");
        }
    }, [open]);


    useEffect(() => {
        if (open) {
            void loadAttributes();
            void loadFormulas();
        }
    }, [open, loadAttributes, loadFormulas]);


    const renderFormulaName = useCallback(async () => {
        const formulaObj = formulas.find(f => f.id === selectedFormula);
        if (!formulaObj) return;

        const context = {
            model: data?.features_title?.[0] ?? "", attributes: {}
        };

        exists.forEach(e => {
            const v = e.attr_value_ids[0];
            context.attributes[e.key] = {
                alias: v.alias, value: v.value
            };
        });

        const result = await fetchPostData(`/service/formula-expression/${selectedFormula}/preview`, {context});

        const value = result?.result;

        if (typeof value === "string" && value.startsWith("__MISSING_ATTRIBUTE__")) {
            message.error("Выбрана наверная формула, проверь");
            setGeneratedName("");
            return;
        }

        if (value) {
            setGeneratedName(value);
        }
    }, [formulas, selectedFormula, exists, data]);

    useEffect(() => {
        const allSelected = allowable.length > 0 && exists.length === allowable.length;

        if (open && selectedFormula && allSelected) {
            void renderFormulaName();
        }
    }, [open, selectedFormula, exists, allowable, renderFormulaName]);


    const handleFormulaChange = useCallback(async (formulaId) => {
        setSelectedFormula(formulaId);

        await fetchPostData(`/service/formula-expression/is_default?formula_id=${formulaId}`);

        setFormulas(prev => prev.map(f => f.id === formulaId ? {...f, is_default: true} : {...f, is_default: false}));
    }, []);


    const getSelectedValue = useCallback(key_id => exists.find(e => e.key_id === key_id)?.attr_value_ids?.[0]?.id ?? null, [exists]);

    const handleSelect = useCallback((attr, selectedId) => {
        const selectedValue = attr.attr_value_ids.find(v => v.id === selectedId);

        setExists(prev => {
            const existsForKey = prev.find(e => e.key_id === attr.key_id);

            if (!existsForKey) {
                return [...prev, {
                    key_id: attr.key_id, key: attr.key, attr_value_ids: [selectedValue]
                }];
            }

            return prev.map(ex => ex.key_id === attr.key_id ? {...ex, attr_value_ids: [selectedValue]} : ex);
        });
    }, []);

    const saveAttributesValues = useCallback(async () => {
        if (!data) return;

        const values = exists.map(e => e.attr_value_ids[0].id);

        const payload = {
            origin: data.origin, values, title: generatedName || data.title
        };

        const result = await fetchPostData("/service/add_attributes_values", payload);

        if (result?.status) {
            message.success("Атрибуты успешно сохранены");
            onSaved?.({
                origin: payload.origin, title: payload.title, attributes: exists.map(e => e.attr_value_ids[0])
            });
            onClose();
            return;
        }
        message.error(result?.message || "Ошибка при сохранении атрибутов");
    }, [data, exists, generatedName, onClose, onSaved]);


    const renderAttribute = useCallback(attr => {
        const selected = getSelectedValue(attr.key_id);

        return (
            <div key={attr.key_id} style={{marginBottom: 16, textAlign: "center"}}>
                <Radio.Group value={selected}
                             onChange={e => handleSelect(attr, e.target.value)}>
                    <div style={{display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap"}}>
                        {attr.attr_value_ids.map(v => (<Radio.Button
                            size="small"
                            key={v.id}
                            value={v.id}
                            style={{borderRadius: 6, cursor: "pointer", textAlign: "center"}}>
                            <div style={{display: "flex", flexDirection: "column", lineHeight: 1}}>
                                <span style={{fontSize: 16, fontWeight: 600}}>{v.value}</span>
                                <span style={{fontSize: 13, color: "#a8a8a8"}}>{v.alias}</span>
                            </div>
                        </Radio.Button>))}
                    </div>
                </Radio.Group>
            </div>);
    }, [getSelectedValue, handleSelect]);

    return (
        <Modal open={open} onCancel={onClose} width={700} footer={null}>
            {!loading && (<>
                <div style={{
                    fontWeight: 600, fontSize: 18, display: "flex", flexDirection: "row", alignItems: "center"
                }}>
                    Формула
                    <Select
                        style={{width: 240, margin: 12}}
                        placeholder="Выберите формулу"
                        value={selectedFormula}
                        onChange={handleFormulaChange}
                        options={formulas.map(f => ({
                            label: f.name + (f.is_default ? " ⭐" : ""), value: f.id
                        }))}
                    />
                </div>

                {allowable.length > 0 && (<div>{allowable.map(renderAttribute)}</div>)}

                <Row gutter={10} justify="center">

                    <Col span={12}>
                        <AttributesImageContainer data={data} onUploaded={onUploaded}/>
                    </Col>

                    <Col span={12}>
                        {Array.isArray(data?.features_title) && data.features_title.length > 0 ? (<>
                            <div style={{padding: 10, fontWeight: 500}}>{data?.title ?? ""}</div>
                            <Input
                                style={{
                                    width: "90%",
                                    padding: "6px 10px",
                                    marginBottom: 12,
                                    borderRadius: 6,
                                    border: "1px solid #d9d9d9",
                                    fontSize: 13
                                }}
                                value={generatedName}
                                onChange={e => setGeneratedName(e.target.value)}
                            />
                        </>) : (<div style={{color: "#999", fontStyle: "italic"}}>
                            Не выставлена зависимость модели
                        </div>)}
                    </Col>
                </Row>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {generatedName && (<Button onClick={saveAttributesValues} type="primary">
                        <SaveOutlined style={{fontSize: 20}}/>
                    </Button>)}
                </div>
            </>)}
        </Modal>);
};

export default AttributesModal;
