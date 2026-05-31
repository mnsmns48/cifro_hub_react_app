import {useState} from "react";
import {InputNumber, Button, Spin, Typography, Card} from "antd";
import {fetchPostData} from "../Common/api.js";


const {Text, Paragraph} = Typography;

const DescriptionGenerator = () => {
    const [productId, setProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    const generate = async () => {
        if (!productId) {
            setError("Введите product_features_id");
            return;
        }
        setError(null);
        setLoading(true);
        setDescription("");

        try {
            const res = await fetchPostData(
                "/service/desc-builder/generate_description",
                {product_features_id: productId}
            );

            if (res && res.description !== undefined) {
                setDescription(res.description);
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
        setProductId(null);
        setDescription("");
        setError(null);
    };

    return (
        <Card title="Генератор описания" style={{marginTop: 20}}>
            <div style={{display: "flex", gap: 10, alignItems: "center"}}>
                <InputNumber
                    placeholder="product_features_id"
                    value={productId}
                    onChange={setProductId}
                    style={{width: 200}}
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

            {description && (
                <Card style={{marginTop: 20, background: "#fafafa"}}>
                    <pre style={{whiteSpace: "pre-wrap"}}>
                        {description}
                    </pre>
                </Card>
            )}
        </Card>
    );
};

export default DescriptionGenerator;
