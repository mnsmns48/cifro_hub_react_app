import {List, Button, Spin} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {Suspense, useState} from "react";
import {createHubLoading} from "../HubMenuLevels/api.js";
import HubMenuLevels from "../HubMenuLevels.jsx";


const InHubDownloader = ({
                             vslId,
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
        const stocksPayload = {
            vsl_id: vslId,
            stocks: items.map(item => ({
                origin: item.origin,
                path_id: selectedPathId,
                warranty: item.warranty,
                input_price: item.input_price,
                output_price: item.output_price,
                profit_range: item.profit_range
            }))
        };

        try {
            const result = await createHubLoading(stocksPayload);
            if (result?.status === true) {
                onConfirm("Позиции успешно добавлены в хаб", result.updated_origins);
            } else {
                onConfirm("Неверный ответ от сервера", []);
            }
        } catch (err) {
            onConfirm(`Ошибка при создании HubLoading: ${err}`);
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
                            </List.Item>
                        )}
                    />

                    <div style={{marginTop: 20}}>
                        <Suspense fallback={<Spin/>}>
                            <HubMenuLevels onSelectPath={setSelectedPathId} simplified={false} compareElements={items}/>
                        </Suspense>
                    </div>
                </>
            }
            footer={
                <>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button type="primary" onClick={handleAddToHub} disabled={selectedPathId == null} loading={saving}>
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
