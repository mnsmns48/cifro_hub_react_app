import {useState} from "react";
import {Input, Button, Spin, Typography, Card, Space, Row, Col} from "antd";
import {fetchPostData} from "../Common/api.js";
import CompactFormulaSelector from "./CompactFormulaSelector.jsx";

const {Text, Paragraph} = Typography;

const DescriptionGenerator = ({formulaId}) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultMap, setResultMap] = useState({});
    const [error, setError] = useState(null);

    const parseIds = () => {
        return inputValue
            .split(",")
            .map(v => v.trim())
            .filter(Boolean)
            .map(v => Number(v))
            .filter(v => !isNaN(v));
    };

    const generate = async () => {
        const ids = parseIds();
        if (ids.length === 0) {
            setError("Введите хотя бы один product_features_id");
            return;
        }

        setError(null);
        setLoading(true);
        setResultMap({});

        const product_features_map = {};
        ids.forEach(id => {
            product_features_map[id] = null;
        });

        try {
            const res = await fetchPostData(
                "/service/desc-builder/generate_description",
                {product_features_map}
            );

            if (res && typeof res === "object") {
                setResultMap(res);
            } else {
                setError("Пустой ответ");
            }
        } catch (e) {
            console.error(e);
            setError("Ошибка генерации");
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setInputValue("");
        setResultMap({});
        setError(null);
    };

    return (
        <>
            <Card title="Генератор описаний (множественный)" style={{marginTop: 20}}>
                <div style={{display: "flex", gap: 10, alignItems: "center"}}>
                    <Input
                        placeholder="product_features_id через запятую, например: 10, 11, 12"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        style={{width: 400}}
                    />
                    <Button type="primary" onClick={generate} disabled={loading}>
                        Сгенерировать
                    </Button>
                    <Button danger onClick={clearAll}>
                        Очистить
                    </Button>
                </div>
                {loading && (
                    <div style={{marginTop: 20}}>
                        <Spin/> <Text>Генерация…</Text>
                    </div>
                )}
                {error && (
                    <Paragraph type="danger" style={{marginTop: 20}}>
                        {error}
                    </Paragraph>
                )}
            </Card>
            <Row>
                <Col span={12}>
                    <CompactFormulaSelector
                        types={[
                            { id: 1, title: "Смартфоны" },
                            { id: 2, title: "Ноутбуки" }
                        ]}
                        sources={["gsmarena", "nanoreview", "custom"]}
                        formulas={[
                            { id: 19, name: "Формула смартфонов", type_id: 1, source: "gsmarena" },
                            { id: 22, name: "Формула смартфонов NR", type_id: 1, source: "nanoreview" },
                            { id: 31, name: "Формула ноутбуков", type_id: 2, source: "gsmarena" }
                        ]}
                        onChange={(ctx) => console.log("Выбрано:", ctx)}
                    />

                </Col>
                <Col span={12}>
                    {Object.keys(resultMap).length > 0 && (
                        <Space direction="vertical" style={{width: "100%", marginTop: 20}}>
                            {Object.entries(resultMap).map(([productId, data]) => (
                                <Card key={productId} title={`Product ID: ${productId}`}
                                      style={{background: "#fafafa"}}>
                                    <Space wrap={true} direction="vertical">
                                        {data.blocks.map((block, index) => (
                                            <div key={index} style={{display: "flex", gap: 10}}>
                                                {block.icon && (
                                                    <img src={block.icon} alt="" style={{
                                                        width: 28,
                                                        height: 28,
                                                        opacity: 0.8,
                                                        marginTop: 4
                                                    }}
                                                    />
                                                )}
                                                <Paragraph style={{margin: 0, whiteSpace: "pre-wrap"}}>
                                                    {block.text}
                                                </Paragraph>
                                            </div>
                                        ))}
                                    </Space>
                                </Card>
                            ))}
                        </Space>
                    )}
                </Col>
            </Row>

        </>
    );
};

export default DescriptionGenerator;
