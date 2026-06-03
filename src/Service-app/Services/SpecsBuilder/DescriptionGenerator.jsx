import {useState} from "react";
import {Input, Button, Spin, Typography, Card, Space, Row, Col, message} from "antd";
import {fetchPostData} from "../Common/api.js";

const {Text, Paragraph} = Typography;

const DescriptionGenerator = () => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultMap, setResultMap] = useState({});


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
            message.warning("Введите хотя бы один product_features_id");
            return;
        }
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
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{marginTop: 20}}>
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
            </div>
            {loading && (
                <div style={{marginTop: 20}}>
                    <Spin/> <Text>Генерация…</Text>
                </div>
            )}
            {Object.keys(resultMap).length > 0 && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    width: "100%",
                    marginTop: 4
                }}>
                    {Object.entries(resultMap).map(([productId, data]) => (
                        <Card key={productId} title={`Product ID: ${productId}`} style={{background: "#fafafa"}}>
                            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                                {data.blocks.map((block, index) => (
                                    <div key={index} style={{display: "flex", gap: 10}}>
                                        {block.icon && (
                                            <img src={block.icon} alt="" style={{
                                                width: 28, height: 28, opacity: 0.8, marginTop: 4
                                            }}/>
                                        )}
                                        <Paragraph style={{margin: 0, whiteSpace: "pre-wrap"}}>
                                            {block.text}
                                        </Paragraph>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DescriptionGenerator;
