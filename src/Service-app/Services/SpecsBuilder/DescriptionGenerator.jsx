import {forwardRef, useImperativeHandle, useState} from "react";
import {Input, Button, Spin, Typography, Card, message, Alert} from "antd";
import {fetchPostData} from "../Common/api.js";

const {Text, Paragraph} = Typography;

const DescriptionGenerator = forwardRef((props, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    const [errorObj, setErrorObj] = useState(null);
    const [products, setProducts] = useState({});

    const parseIds = () => {
        return inputValue
            .split(",")
            .map(v => v.trim())
            .filter(Boolean)
            .map(Number)
            .filter(v => !isNaN(v));
    };

    const generate = async () => {
        const ids = parseIds();
        if (ids.length === 0) {
            message.warning("Введите хотя бы один product_features_id");
            return;
        }

        setLoading(true);
        setErrorObj(null);
        setProducts({});

        const product_features_map = {};
        ids.forEach(id => product_features_map[id] = null);

        try {
            const res = await fetchPostData(
                "/service/desc-builder/generate_description",
                {product_features_map}
            );

            if (!res || typeof res !== "object") {
                setErrorObj({error: "BadResponse", details: "Некорректный ответ сервера"});
                return;
            }

            if (res.error) {
                setErrorObj(res.error);
                return;
            }

            if (res.success && res.success.products) {
                setProducts(res.success.products);
                return;
            }

            setErrorObj({error: "UnknownFormat", details: "Неизвестный формат ответа сервера"});

        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        regenerate() {
            if (Object.keys(products).length > 0) {
                void generate();
            }
        }
    }));

    return (
        <>
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

            {errorObj && (
                <Alert
                    style={{marginTop: 20}}
                    type="error"
                    message={errorObj.error}
                    description={errorObj.details}
                    showIcon
                />
            )}

            {Object.keys(products).length > 0 && (
                <div style={{display: "flex", flexDirection: "column", gap: 4, marginTop: 4}}>
                    {Object.entries(products).map(([productId, data]) => (
                        <Card key={productId} title={`Product ID: ${productId}`} style={{background: "#fafafa"}}>
                            {data.blocks.map((block, index) => (
                                <div key={index} style={{display: "flex", gap: 10, alignItems: "center"}}>
                                    {block.icon && (
                                        <img src={block.icon} alt="" style={{width: 28, height: 28, opacity: 0.8}}/>
                                    )}
                                    <Paragraph style={{margin: 0, whiteSpace: "pre-wrap"}}>
                                        {block.text}
                                    </Paragraph>
                                </div>
                            ))}
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
});

DescriptionGenerator.displayName = "DescriptionGenerator";
export default DescriptionGenerator;
