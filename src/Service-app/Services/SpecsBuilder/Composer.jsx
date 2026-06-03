import {Col, Row, Spin, Table, Form, Input, Button, Card, message} from "antd";
import {useEffect, useState} from "react";
import {fetchGetData} from "../Common/api.js";
import {getComposerColumns} from "./ComposerTableColumns.jsx";
import DescriptionGenerator from "./DescriptionGenerator.jsx";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const {TextArea} = Input;

const Composer = ({formulaEntityTypeId}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFormula, setSelectedFormula] = useState(null);

    const [form] = Form.useForm();

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
        return (<Spin size="large"/>);
    }

    const handleEditFormula = (formula) => {
        setSelectedFormula(formula);
        setIsEditing(true);
        form.setFieldsValue({formula: formula.formula, is_active: formula.is_active});
    };

    const handleSave = async () => {
        await form.validateFields();
        message.success("Формула сохранена (заглушка)");
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
                    <Card title={`Редактирование формулы: ${selectedFormula?.name}`} style={{marginBottom: 16}}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="formula" rules={[{required: true}]}>
                                <TextArea rows={10}/>
                            </Form.Item>
                            <div style={{display: "flex", gap: 10}}>
                                <Button type="primary" icon={<CheckOutlined/>} onClick={handleSave}/>
                                <Button icon={<CloseOutlined/>} onClick={handleCancel}/>
                            </div>
                        </Form>
                    </Card>
                )}

                <Table rowKey="id" columns={columns} dataSource={data.composers} pagination={false}/>
            </Col>

            <Col span={8}>
                <DescriptionGenerator/>
            </Col>
        </Row>
    );
};

export default Composer;