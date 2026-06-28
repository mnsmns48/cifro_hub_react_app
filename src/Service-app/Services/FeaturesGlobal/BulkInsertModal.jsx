import {Modal, Input, Button, message, Space} from "antd";
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import {useState} from "react";
import {fetchPostData} from "../Common/api.js";

const {TextArea} = Input;

const emptyBlock = {param: "", bulk: ""};

const BulkInsertModal = ({open, onClose, featureId, addedFromBulk}) => {

    const [loading, setLoading] = useState(false);

    const [blocks, setBlocks] = useState([
        {
            param: "Основные",
            bulk: ""
        }
    ]);

    const changeParam = (index, value) => {
        setBlocks(prev =>
            prev.map((item, i) =>
                i === index ? {...item, param: value} : item
            )
        );
    };

    const changeBulk = (index, value) => {
        setBlocks(prev =>
            prev.map((item, i) =>
                i === index ? {...item, bulk: value} : item
            )
        );
    };

    const addBlock = () => {
        setBlocks(prev => [...prev, {...emptyBlock}]);
    };

    const removeBlock = (index) => {
        setBlocks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {

        const filtered = blocks.filter(
            b => b.param.trim() && b.bulk.trim()
        );

        if (!filtered.length) {
            message.error("Добавьте хотя бы один заполненный блок");
            return;
        }

        setLoading(true);

        try {

            const resp = await fetchPostData(
                "/service/features/insert_bulk_params",
                {
                    feature_id: featureId,
                    bulk: filtered
                }
            );

            await addedFromBulk(resp);
            setBlocks([
                {
                    param: "Основные",
                    bulk: ""
                }
            ]);

            onClose();

        } catch (e) {
            message.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            width={800}
            footer={null}
            title="Вставка характеристик"
            onCancel={onClose}
        >

            {blocks.map((block, index) => (

                <div
                    key={index}
                    style={{
                        border: "1px solid #f0f0f0",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 16
                    }}
                >

                    <Space
                        style={{
                            width: "100%",
                            justifyContent: "space-between",
                            marginBottom: 8
                        }}
                    >

                        <Input
                            placeholder="Название блока"
                            value={block.param}
                            onChange={(e) =>
                                changeParam(index, e.target.value)
                            }
                        />

                        {index > 0 && (
                            <Button
                                danger
                                icon={<DeleteOutlined/>}
                                onClick={() => removeBlock(index)}
                            />
                        )}

                    </Space>

                    <TextArea
                        rows={8}
                        placeholder="Параметр: значение"
                        value={block.bulk}
                        onChange={(e) =>
                            changeBulk(index, e.target.value)
                        }
                    />

                </div>

            ))}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 16
                }}
            >

                <Button
                    icon={<PlusOutlined/>}
                    onClick={addBlock}
                >
                    Добавить блок
                </Button>

                <Space>
                    <Button onClick={onClose}>
                        Отмена
                    </Button>

                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Загрузить
                    </Button>
                </Space>

            </div>

        </Modal>
    );
};

export default BulkInsertModal;