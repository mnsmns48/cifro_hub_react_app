import { List, Button, Spin } from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import { formatDate } from "../../../../utils.js";
import HubMenuLevels from "../HubMenuLevels.jsx";
import { Suspense, useState } from "react";
import {createHubLoading} from "../HubMenuLevels/api.js";


const InHubDownloader = ({
                             VslId,
                             resultObj,
                             isOpen,
                             items,
                             onCancel,
                             onConfirm
                         }) => {
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleAddToHub = async () => {
        if (selectedPathId == null) return;
        setSaving(true);

        const stocksPayload = items.map(item => ({
            origin: item.origin,
            pathId: selectedPathId,
            warranty: item.warranty,
            outputPrice: item.output_price
        }));

        try {
            const result = await createHubLoading({
                vslId: VslId,
                datestamp: resultObj.datestamp,
                stocks: stocksPayload
            });
            console.log("Создан HubLoading:", result);
            onConfirm(result);
        } catch (err) {
            console.error("Ошибка при создании HubLoading:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onCancel}
            title="Добавить в Хаб"
            content={
                <>
                    <List
                        size="small"
                        bordered
                        dataSource={items}
                        renderItem={item => (
                            <List.Item
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    fontSize: 12
                                }}
                            >
                                <div>{item.origin}</div>
                                <span>{item.title}</span>
                                <b>{item.output_price}</b>
                                <span>{formatDate(resultObj.datestamp)}</span>
                            </List.Item>
                        )}
                    />

                    <div style={{ marginTop: 20 }}>
                        <Suspense fallback={<Spin tip="Загрузка хаба..." />}>
                            <HubMenuLevels onSelectPath={setSelectedPathId} />
                        </Suspense>
                    </div>
                </>
            }
            footer={
                <>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button
                        type="primary"
                        onClick={handleAddToHub}
                        disabled={selectedPathId == null}
                        loading={saving}
                    >
                        Добавить
                    </Button>
                </>
            }
            danger={false}
            closable={true}
        />
    );
};

export default InHubDownloader;
