import {useEffect, useState} from "react";
import {Table, Spin, Button, Popconfirm, Tabs} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {consentDataApiLoad} from "./api.js";
import getConsentTableColumns from "./ConsentTableColumns.jsx";

const Consent = ({path_ids, isOpen, onClose}) => {
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsent = async () => {
            try {
                const result = await consentDataApiLoad({ path_ids });
                setGroupedData(result);
            } catch (e) {
                console.error("Ошибка загрузки данных:", e);
            } finally {
                setLoading(false);
            }
        };

        if (Array.isArray(path_ids) && path_ids.length > 0) {
            void fetchConsent();
        }
    }, [path_ids]);

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ textAlign: "center", padding: 24 }}>
                    <Spin tip="Загрузка данных..." />
                </div>
            );
        }

        const tabItems = Object.entries(groupedData).map(([pathId, items]) => ({
            key: pathId,
            label: `Path ${pathId}`,
            children: (
                <Table
                    rowKey="id"
                    dataSource={items}
                    columns={getConsentTableColumns()}
                    pagination={false}
                />
            ),
        }));

        return <Tabs items={tabItems} />;
    };

    const renderFooter = () => (
        <Popconfirm
            title="Закрываем сверку?"
            okText="Да"
            cancelText="Нет"
            onConfirm={onClose}
        >
            <Button type="primary">Закрыть</Button>
        </Popconfirm>
    );

    return (
        <MyModal
            isOpen={isOpen}
            onClose={onClose}
            content={renderContent()}
            footer={renderFooter()}
            width={1200}
        />
    );
};

export default Consent;
