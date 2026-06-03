import {Col, Row, Table, Form, Input, Button, Card} from "antd";
import {useEffect, useState} from "react";
import {fetchGetData, fetchPostData} from "../Common/api.js";
import {getComposerColumns} from "./ComposerTableColumns.jsx";
import DescriptionGenerator from "./DescriptionGenerator.jsx";
import {ArrowLeftOutlined, CheckOutlined} from "@ant-design/icons";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {getSpecsPathColumns} from "./SpecsPathColumns.jsx";

const {TextArea} = Input;




const Composer = ({formulaEntityTypeId}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFormula, setSelectedFormula] = useState(null);
    const [specPaths, setSpecPaths] = useState({});


    const [form] = Form.useForm();


    useEffect(() => {
        if (!selectedFormula) return;

        const formulaId = selectedFormula.formula.id;
        const source = selectedFormula.source;

        void loadSpecPaths(formulaId, source);
    }, [selectedFormula?.formula.id, selectedFormula?.source]);


    useEffect(() => {
        if (!formulaEntityTypeId) return;

        const load = async () => {
            setLoading(true);
            const res = await fetchGetData(`/service/desc-builder/fetch_composer/${formulaEntityTypeId}`);
            setData(res);
            setLoading(false);
        };
        void load();
    }, [formulaEntityTypeId]);

    if (loading) {
        return (<Spinner/>);
    }


    const loadSpecPaths = async (formulaId, source) => {
        const res = await fetchPostData(
            "/service/desc-builder/fetch_spec_path",
            {formula_id: formulaId, source}
        );

        setSpecPaths(prev => ({...prev, [formulaId]: res || []}));
    };


    const handleEditFormula = (record) => {
        setSelectedFormula(record);
        setIsEditing(true);

        form.setFieldsValue({
            formula: record.formula.formula,
            is_active: record.formula.is_active
        });
    };


    const handleSave = async () => {
        await form.validateFields();
        setIsEditing(false);
        setSelectedFormula(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFormula(null);
    };

    const columns = getComposerColumns({onEditFormula: handleEditFormula});




    return (
        <Row gutter={10} align="top">
            <Col span={16}>
                {isEditing && (
                    <Card
                        key={selectedFormula?.formula.id}
                        title={`Редактирование формулы: ${selectedFormula?.formula.name} ${selectedFormula?.source}`}
                        variant={"borderless"}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item name="formula" rules={[{required: true}]}>
                                <TextArea rows={10}/>
                            </Form.Item>
                            <div style={{display: "flex", gap: 10}}>
                                <Button icon={<ArrowLeftOutlined/>} onClick={handleCancel}/>
                                <Button type="primary" icon={<CheckOutlined/>} onClick={handleSave}/>
                            </div>
                        </Form>

                        <Table
                            rowKey={(_, index) => index}
                            style={{marginTop: 15}}
                            dataSource={specPaths[selectedFormula?.formula.id] || []}
                            pagination={false}
                            size="small"
                            columns={getSpecsPathColumns()}
                        />
                    </Card>
                )}

                <Table rowKey="id" columns={columns}
                       dataSource={data.composers}
                       pagination={false}
                       size="small"
                       style={{marginTop: 15}}/>
            </Col>

            <Col span={8}>
                <DescriptionGenerator/>
            </Col>
        </Row>
    );
};
export default Composer;