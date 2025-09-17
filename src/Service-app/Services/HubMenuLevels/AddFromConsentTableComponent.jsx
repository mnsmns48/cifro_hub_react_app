import MyModal from "../../../Ui/MyModal.jsx";
import {Button, Table, Typography, Divider} from "antd";
import {comparisonRecomputedData, storeRecomputedData} from "./api.js";
import {useEffect, useState} from "react";

const {Text} = Typography;

const AddFromConsentTableComponent = ({path_ids = [], origins = [], isOpen, onClose, onApply}) => {
    const [reCalcLoad, setReCalcLoad] = useState([]);


    useEffect(() => {
        let payload = null;

        if (origins.length) {
            payload = {path_ids: null, origins: origins.map(Number)};
        } else if (path_ids.length) {
            payload = {path_ids: path_ids.map(Number), origins: null};
        } else {
            return;
        }

        comparisonRecomputedData(payload).then(setReCalcLoad);
    }, [path_ids, origins]);


    const handleApplyUpdate = async () => {
        try {
            const result = await storeRecomputedData(reCalcLoad);
            if (onApply) {
                onApply(result);
            }
            onClose();
        } catch (error) {
            console.error("Ошибка при сохранении новых цен:", error);
        }
    };

    const renderContent = () => {
        if (!reCalcLoad.length) {
            return <Text type="secondary">Нет изменений цен</Text>;
        }

        return (
            <>
                {reCalcLoad.map(group => (
                    <div key={group.path_id} style={{marginBottom: 24}}>
                        <Divider orientation="left">{group.label}</Divider>
                        <Table
                            dataSource={group.recomputed_items}
                            rowKey="origin"
                            pagination={false}
                            size="small"
                            bordered={false}
                            columns={[
                                {
                                    title: "Origin",
                                    dataIndex: "origin",
                                    key: "origin",
                                    width: 100
                                },
                                {
                                    title: "Название",
                                    dataIndex: "title",
                                    key: "title"
                                },
                                {
                                    title: "Старая цена",
                                    dataIndex: "output_stock_price",
                                    key: "output_stock_price",
                                },
                                {
                                    title: "Новая цена",
                                    dataIndex: "output_parsing_price",
                                    key: "output_parsing_price",
                                    render: (value, record) => {
                                        const old = record.output_stock_price;
                                        if (value > old) {
                                            return <Text type="success">{value}</Text>;
                                        } else if (value < old) {
                                            return <Text type="danger">{value}</Text>;
                                        } else {
                                            return <Text>{value}</Text>;
                                        }
                                    }
                                }
                            ]}
                        />
                    </div>
                ))}
            </>
        );
    };


    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onClose}
            title="Обновляем"
            content={renderContent()}
            footer={
                <>
                    <Button type="primary" onClick={handleApplyUpdate} style={{padding: "6px 12px"}}>
                        Обновляем
                    </Button>
                    <Button onClick={onClose} style={{padding: "6px 12px"}}>
                        Закрыть
                    </Button>
                </>
            }
            width={800}
        />
    );
};


export default AddFromConsentTableComponent;