import {useEffect, useState, useCallback} from "react";
import {fetchGetData, fetchPostData} from "../../SchemeAttributes/api.js";
import {Button, Col, Modal, Radio, Row, Select, message, Input, Spin, Popconfirm} from "antd";
import {FileImageOutlined, LoadingOutlined, SaveOutlined} from "@ant-design/icons";
import AttributesImageContainer from "./AttributeImageConteiner.jsx";
import MultiUploadDropzone from "./MultiUploadDropzone.jsx";


const AttributesModal = ({open, data, onClose, onSaved, onUploaded}) => {
    const [loading, setLoading] = useState(false);
    const [allowable, setAllowable] = useState([]);
    const [exists, setExists] = useState([]);
    const [formulas, setFormulas] = useState([]);
    const [selectedFormula, setSelectedFormula] = useState(null);
    const [generatedName, setGeneratedName] = useState("");
    const [showImages, setShowImages] = useState(false);
    const [dependencyList, setDependencyList] = useState([]);
    const [selectedDependencyOrigin, setSelectedDependencyOrigin] = useState(null);
    const [popConfirmOpen, setPopConfirmOpen] = useState(false);
    const [haveImages, setHaveImages] = useState(false);


    const loadAttributes = useCallback(async () => {
        if (!open || !data) return null

        setLoading(true);

        const result = await fetchPostData("service/attributes/attributes_origin_value_check_request", {
            origin: data.origin, model_id: data.model_id, title: data.title
        });

        setAllowable(result?.attributes_allowable ?? []);
        setExists(result?.attributes_exists ?? []);
        setHaveImages(result?.have_images ?? false);
        if (result?.have_images) {
            setShowImages(true);
        }

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


    const loadDependencyList = async () => {
        if (!data?.origin) return;

        try {
            const resp = await fetchGetData(`/service/load_dependency_images_list/${data.origin}`);
            setDependencyList(resp);
        } catch (e) {
            console.error("Ошибка загрузки зависимых изображений", e);
        }
    };


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
            setShowImages(false);
        }
    }, [open]);


    useEffect(() => {
        if (open) {
            void loadAttributes();
            void loadFormulas();
            setSelectedDependencyOrigin(null);
        }
    }, [open, loadAttributes, loadFormulas]);


    const renderFormulaName = useCallback(async () => {
        const formulaObj = formulas.find(f => f.id === selectedFormula);
        if (!formulaObj) return;

        const context = {
            model: data?.features_title?.[0] ?? "",
            attributes: {}
        };

        exists.forEach(e => {
            const v = e.attr_value_ids[0];
            context.attributes[e.key] = {
                alias: v.alias,
                value: v.value
            };
        });

        const result = await fetchPostData(
            `/service/formula-expression/${selectedFormula}/preview`,
            { context }
        );

        const value = result?.result;

        if (typeof value === "string" && value.startsWith("__MISSING_ATTRIBUTES__")) {
            const missing = value.replace("__MISSING_ATTRIBUTES__:", "").trim();
            message.error(`В формуле отсутствуют переменные: ${missing}`);
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

    const handleImplementDependencyImages = async () => {
        if (!selectedDependencyOrigin || !data?.origin) return;

        const payload = {
            target_origin: data.origin,
            image_same_origin: selectedDependencyOrigin
        };

        try {
            const resp = await fetchPostData("/service/implement_dependency_images", payload);
            onUploaded({
                    images: resp,
                    preview: resp.find(i => i.is_preview)?.url || resp[0]?.url || null
                },
                data.origin);
        } catch (e) {
            console.error(e);
            message.error("Ошибка при переносе картинок");
        }
    };


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
        <Modal
            open={open}
            onCancel={onClose}
            width={700}
            footer={null}
        >
            <>
                <div style={{
                    fontWeight: 600, fontSize: 18, display: "flex", flexDirection: "row", alignItems: "center"
                }}>
                    Формула
                    <Select
                        style={{width: 380, margin: 12}}
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

                    <Col span={12} style={{position: "relative"}}>

                        {loading && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    zIndex: 20
                                }}
                            >
                                <Spin size="small"/>
                            </div>
                        )}

                        {!showImages && !haveImages && (
                            <Button onClick={() => setShowImages(true)} style={{marginTop: 4}}>
                                Синхронизировать картинки <FileImageOutlined style={{fontSize: 20}}/>
                            </Button>
                        )}


                        {showImages && data?.origin && (
                            <div style={{margin: 10}}>
                                <div style={{margin: 10}}>
                                    <MultiUploadDropzone
                                        origin={data.origin}
                                        onUploaded={onUploaded}
                                        onLoadingChange={setLoading}
                                    />
                                </div>
                                <AttributesImageContainer
                                    data={data}
                                    onUploaded={onUploaded}
                                    onLoadingChange={setLoading}
                                />
                            </div>
                        )}
                        <div style={{marginTop: 20, display: "flex", gap: 8}}>
                            <Popconfirm
                                title="Перенести картинки?"
                                description="Все картинки у товара будут заменены"
                                open={popConfirmOpen}
                                onConfirm={async () => {
                                    await handleImplementDependencyImages();
                                    setPopConfirmOpen(false);
                                }}
                                onCancel={() => {
                                    setPopConfirmOpen(false);
                                }}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Select
                                    style={{width: '100%'}}
                                    showSearch
                                    value={selectedDependencyOrigin}
                                    placeholder="Картинки из"
                                    onFocus={loadDependencyList}
                                    options={dependencyList.map(item => ({
                                        label: (
                                            <span style={{fontSize: 10}}>
                                                <span style={{color: 'red'}}>{item.qnt_images} </span>
                                                {item.title}
                                            </span>
                                        ),
                                        value: item.origin,
                                        searchValue: item.title,
                                    }))}
                                    filterOption={(input, option) =>
                                        option?.searchValue
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    onChange={(value) => {
                                        setSelectedDependencyOrigin(value);
                                        setPopConfirmOpen(true);
                                    }}
                                />
                            </Popconfirm>
                        </div>

                    </Col>

                    <Col span={12}>
                        {Array.isArray(data?.features_title) && data.features_title.length > 0 ? (
                            <>
                                <div style={{padding: 10, fontWeight: 500}}>
                                    {data?.title ?? ""}
                                </div>

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

                                {generatedName && (
                                    <Button onClick={saveAttributesValues}
                                            type="primary"
                                            style={{marginTop: 4}}
                                    >
                                        <SaveOutlined style={{fontSize: 20}}/>
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8
                            }}>
                                <LoadingOutlined/>
                                <div style={{color: "#801313", fontStyle: "Bold"}}>
                                    Не выставлена зависимость модели
                                </div>
                            </div>

                        )}
                    </Col>

                </Row>
            </>
        </Modal>
    );

};

export default AttributesModal;
