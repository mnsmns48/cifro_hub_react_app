import {List, Button, Spin} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {formatDate} from "../../../../utils.js";
import HubMenuLevels from "../HubMenuLevels.jsx";
import {Suspense, useState} from "react";

const InHubDownloader = ({
                             rowId,
                             resultObj,
                             isOpen,
                             items,
                             onCancel,
                             onConfirm
                         }) => {
    const [selectedPathId, setSelectedPathId] = useState(null);

    return (
        <MyModal
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            title="Добавить в Хаб"
            content={<>
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
                <div style={{marginTop: 20}}>
                    <Suspense fallback={<Spin tip="Загрузка хаба..." />}>
                        <HubMenuLevels onAddToHub={setSelectedPathId} />
                    </Suspense>
                </div>
            </>
            }
            footer={
                <>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            console.log("Выбранный ID:", selectedPathId);
                            onConfirm(selectedPathId);
                        }}
                        disabled={!selectedPathId || typeof selectedPathId !== "number"}
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
