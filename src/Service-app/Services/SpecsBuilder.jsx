import {useEffect, useRef, useState} from "react";
import {fetchGetData, fetchPutData} from "./Common/api.js";
import {Button, Card, Col, Form, Input, Row, Spin} from "antd";
import {useFormulaTypeSelector} from "./SpecsBuilder/useFormulaTypeSelector.js";
import FormulaTypeSelector from "./SpecsBuilder/FormulaTypeSelector.jsx";
import FiltersFXModal from "./SpecsBuilder/FiltersFXModal.jsx";
import {ArrowLeftOutlined, FunctionOutlined, SaveOutlined} from "@ant-design/icons";
import DescriptionGenerator from "./SpecsBuilder/DescriptionGenerator.jsx";
import Composer from "./SpecsBuilder/Composer.jsx";
import "./SpecsBuilder/SpecsBuilder.css";

const {TextArea} = Input;

const SpecsBuilder = () => {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFormulaName, setCurrentFormulaName] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFormula, setSelectedFormula] = useState(null);

    const [form] = Form.useForm();

    const descRef = useRef(null);

    const loadFormulaLink = async () => {
        try {
            setLoading(true);
            const res = await fetchGetData("/service/desc-builder/fetch_formula_link");
            if (res && res.entity_type) {
                setCurrentFormulaName(res.entity_type.title_type);
                setSelectedEntityType(res.entity_type.id);
            }
        } catch (e) {
            console.error(e);
            setError("Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadFormulaLink();
    }, []);

    const {
        loading: typesLoading,
        types,
        selectedEntityType,
        setSelectedEntityType,
        error: typesError,
        updateFormulaLink
    } = useFormulaTypeSelector(true);

    if (loading) return <div style={{padding: 20}}><Spin/> Загрузка…</div>;
    if (error) return <>Ошибка: {error}</>;

    const handleEditFormula = (record) => {
        setSelectedFormula(record);
        setIsEditing(true);

        form.setFieldsValue({
            formula: record.formula.formula,
            is_active: record.formula.is_active
        });
    };


    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFormula(null);
    };

    const updateFormula = async () => {
        const values = await form.validateFields();

        const res = await fetchPutData(
            `/service/formula-expression/${selectedFormula.formula.id}`,
            values
        );

        if (res) {
            descRef.current?.regenerate();
        }
    };

    return (
        <>
            <div style={{width: "40%"}}>
                <FormulaTypeSelector currentFormulaName={currentFormulaName}
                                     typesLoading={typesLoading}
                                     types={types}
                                     selectedEntityType={selectedEntityType}
                                     setSelectedEntityType={setSelectedEntityType}
                                     typesError={typesError}
                                     updateFormulaLink={updateFormulaLink}
                                     onUpdated={(newName) => {
                                         setCurrentFormulaName(newName)
                                     }}/>
            </div>
            {selectedEntityType && (
                <Row gutter={10} align="top">
                    <Col span={16}>

                        {isEditing && (
                            <Card key={selectedFormula?.formula.id} variant={"borderless"}>
                                <Form form={form} layout="vertical">
                                    <Form.Item name="formula" rules={[{required: true}]}>
                                        <TextArea rows={10}/>
                                    </Form.Item>
                                    <div style={{display: "flex", gap: 10}}>
                                        <Button icon={<ArrowLeftOutlined/>} onClick={handleCancel}/>
                                        <Button icon={<FunctionOutlined/>} onClick={() => setFiltersOpen(true)}/>
                                        <Button type="primary" icon={<SaveOutlined/>} onClick={updateFormula}/>
                                    </div>
                                </Form>

                            </Card>
                        )}
                        <Composer formulaEntityTypeId={selectedEntityType}
                                  selectedFormula={selectedFormula}
                                  onEditFormula={handleEditFormula}
                        />
                    </Col>
                    <Col span={8}>
                        <DescriptionGenerator ref={descRef}/>
                    </Col>
                </Row>
            )}
            <FiltersFXModal open={filtersOpen} onClose={() => setFiltersOpen(false)}/>
        </>
    );
};

export default SpecsBuilder;
