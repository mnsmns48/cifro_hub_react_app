import {List, Button, Spin} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import HubMenuLevels from "../HubMenuLevels.jsx";
import {Suspense, useState} from "react";
import {createHubLoading} from "../HubMenuLevels/api.js";


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
        const stocksPayload = items.map(item => ({
            origin: item.origin,
            pathId: selectedPathId,
            warranty: item.warranty,
            inputPrice: item.input_price,
            outputPrice: item.output_price
        }));
        try {
            const result = await createHubLoading({vsl_id: vslId, stocks: stocksPayload});
            if (result?.status === true) {
                onConfirm("Позиции успешно добавлены в хаб");
            } else {
                onConfirm("Неверный ответ от сервера");
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
                        <Suspense fallback={<Spin tip="Загрузка хаба..."/>}>
                            <HubMenuLevels onSelectPath={setSelectedPathId}/>
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
