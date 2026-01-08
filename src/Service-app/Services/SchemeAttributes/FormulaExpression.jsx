import {useEffect, useState} from "react";
import {
    Card,
    Tag,
    Space,
    Typography,
    Input,
    Collapse,
    Form,
    Switch,
    Button,
    message,
    Modal,
    Col,
    Row
} from "antd";
import {
    fetchGetData,
    fetchPostData,
    fetchPutData
} from "./api.js";
import {ArrowLeftOutlined, CheckCircleOutlined, SaveOutlined} from "@ant-design/icons";

const {Title} = Typography;
const {TextArea} = Input;
const {Panel} = Collapse;

const FormulaExpression = ({formulaId = null, onSaved, onCancel}) => {
    const [schema, setSchema] = useState(null);
    const [filters, setFilters] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        void loadContextSchema();
        void loadFilterDocs();

        if (formulaId) {
            void loadFormula(formulaId);
        } else {
            form.resetFields();
        }
    }, [formulaId]);

    const loadContextSchema = async () => {
        const data = await fetchGetData("/service/formula-expression/context-schema");
        setSchema(data);
    };

    const loadFilterDocs = async () => {
        const data = await fetchGetData("/service/formula-expression/filter-docs");
        setFilters(data);
    };

    const loadFormula = async (id) => {
        const data = await fetchGetData(`/service/formula-expression/${id}`);
        if (data) {
            form.setFieldsValue(data);
        }
    };

    const insertVariable = (variable) => {
        const current = form.getFieldValue("formula") || "";
        form.setFieldValue("formula", current + variable);
    };

    const insertFilter = (filterName, args) => {
        const argsTemplate = args.length
            ? "(" + args.map((a) => a.split(":")[0]).join(", ") + ")"
            : "";

        const filterString = ` | ${filterName}${argsTemplate}`;
        const current = form.getFieldValue("formula") || "";
        const endIndex = current.lastIndexOf("}}");

        let updated;

        if (endIndex === -1) {
            updated = current + filterString;
        } else {
            updated =
                current.slice(0, endIndex).trimEnd() +
                filterString +
                " }}";
        }

        form.setFieldValue("formula", updated);
    };


    const renderVariables = () => {
        if (!schema) return "Загрузка...";

        const items = [{label: "model", value: "{{ model }}"}];

        Object.keys(schema.attributes).forEach((key) => {
            items.push({
                label: `${key}.value`,
                value: `{{ attributes.${key}.value }}`
            });
            items.push({
                label: `${key}.alias`,
                value: `{{ attributes.${key}.alias }}`
            });
        });

        return (
            <Space wrap size={[8, 8]}>
                {items.map((item) => (
                    <Tag key={item.label} color="geekblue"
                        style={{cursor: "pointer", padding: "5px 10px", fontSize: 14}}
                        onClick={() => insertVariable(item.value)}
                    >
                        {item.label}
                    </Tag>
                ))}
            </Space>
        );
    };

    const renderFilters = () => {
        if (!filters) return "Загрузка...";

        return (
            <Collapse accordion>
                {Object.entries(filters).map(([name, info]) => (
                    <Panel header={name} key={name}>
                        <p style={{marginBottom: 8, color: "#666"}}>{info.description}</p>
                        <Tag
                            color="geekblue"
                            style={{cursor: "pointer", padding: "5px 10px", fontSize: 14}}
                            onClick={() => insertFilter(name, info.args)}
                        >
                            Вставить {name}
                        </Tag>

                        <div style={{marginTop: 10, fontSize: 12, color: "#a8a8a8"}}>
                            Пример: <code>{info.example}</code>
                        </div>
                    </Panel>
                ))}
            </Collapse>
        );
    };


    const validateFormula = async () => {
        const formula = form.getFieldValue("formula");

        if (!formula) {
            Modal.error({
                title: "Ошибка",
                content: "Формула пуста"
            });
            return false;
        }

        try {
            const res = await fetchPostData("/service/formula-expression/validate", {
                formula
            });

            if (res.valid) {
                return true;
            }

            const errors = Array.isArray(res.errors)
                ? res.errors
                : [res.error || "Неизвестная ошибка"];

            Modal.error({
                title: "Ошибка в формуле",
                width: 600,
                content: (
                    <div>
                        {errors.map((err, i) => (
                            <div key={i} style={{marginBottom: 8}}>
                                • {err}
                            </div>
                        ))}
                    </div>
                )
            });

            return false;

        } catch (e) {
            Modal.error({
                title: "Ошибка проверки",
                content: "Сервер недоступен или вернул ошибку",
                width: 600
            });
            return false;
        }
    };


    const validateClick = async () => {
        const ok = await validateFormula();
        if (ok) message.success("Формула корректна");
    };


    const saveFormula = async (values) => {
        const ok = await validateFormula();
        if (!ok) return;

        const res = await fetchPostData("/service/formula-expression/", values);
        if (res) {
            message.success("Формула сохранена");
            onSaved();
        }
    };

    const updateFormula = async (values) => {
        const ok = await validateFormula();
        if (!ok) return;

        const res = await fetchPutData(`/service/formula-expression/${formulaId}`, values);
        if (res) {
            message.success("Формула обновлена");
            onSaved();
        }
    };

    return (
        <div>
            <Space direction="vertical" size={24} style={{width: "100%"}}>
                <Title level={3}>Конструктор Формул</Title>

                <Row gutter={24}>
                    <Col span={8}>
                        <Card title="Переменные" size="small" style={{marginBottom: 20}}>
                            {renderVariables()}
                        </Card>

                        <Card title="Фильтры" size="small">
                            {renderFilters()}
                        </Card>
                    </Col>

                    <Col span={16}>
                        <Card title="Параметры формулы" size="small" style={{marginBottom: 20}}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={formulaId ? updateFormula : saveFormula}
                            >
                                <Form.Item
                                    name="name"
                                    label="Название формулы"
                                    rules={[{required: true, message: "Введите название"}]}
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="description" label="Описание">
                                    <Input/>
                                </Form.Item>

                                <Form.Item name="entity_type" label="Тип сущности">
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="formula"
                                    label="Формула"
                                    rules={[{required: true, message: "Введите формулу"}]}
                                >
                                    <TextArea rows={10}/>
                                </Form.Item>

                                <Form.Item
                                    name="is_active"
                                    label="Активна"
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Switch/>
                                </Form.Item>

                                <Form.Item
                                    name="is_default"
                                    label="По умолчанию"
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Switch/>
                                </Form.Item>

                                <div style={{display: "flex", gap: 12}}>
                                    <Button onClick={onCancel} icon={<ArrowLeftOutlined/>}/>
                                    <Button onClick={validateClick} icon={<CheckCircleOutlined/>}/>
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined/>}/>
                                </div>

                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default FormulaExpression;
