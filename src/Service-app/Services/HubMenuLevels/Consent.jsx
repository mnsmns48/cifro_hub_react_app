import {useEffect, useMemo, useState} from "react";
import {Table, Spin, Button, Popconfirm, Tabs} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {consentDataApiLoad} from "./api.js";
import getConsentTableColumns from "./ConsentTableColumns.jsx";


const Consent = ({
                     comparisonObj: {vsl_list, path_ids},
                     isOpen,
                     onClose
                 }) => {
    const [tabsData, setTabsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isRetail, setIsRetail] = useState(false);

    const payload = useMemo(() => ({vsl_list, path_ids}), [vsl_list, path_ids]);

    const columns = useMemo(
        () => getConsentTableColumns(setTabsData),
        [setTabsData]
    );

    useEffect(() => {
        if (!isOpen) {
            setTabsData([]);
            return;
        }

        setLoading(true);
        consentDataApiLoad(payload)
            .then(data => {
                setTabsData(Array.isArray(data) ? data : []);
                console.log("Полученные данные:", data);
            })
            .catch(err => {
                console.error("Ошибка загрузки данных:", err);
                setTabsData([]);
            })
            .finally(() => setLoading(false));
    }, [isOpen, payload]);

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{textAlign: "center", padding: 24}}>
                    <Spin tip="Загрузка данных..."/>
                </div>
            );
        }

        if (!tabsData.length) {
            return (
                <div style={{textAlign: "center", color: "#999", padding: 24}}>
                    Нет данных для отображения
                </div>
            );
        }

        const items = tabsData.map(tab => ({
            key: String(tab.path_id),
            label: tab.label,
            children: (
                <div style={{width: 1220, overflowX: 'auto'}}>
                    <Table
                        rowKey="origin"
                        dataSource={tab.items || []}
                        columns={columns}
                        pagination={false}
                        size="small"
                        tableLayout="fixed"
                        style={{width: "100%"}}
                    />
                </div>
            )
        }));

        return (
            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12
                }}>
                    <div style={{display: "flex", alignItems: "center", gap: 12}}>
                        <div style={{fontWeight: 500, fontSize: 16}}>
                            {isRetail ? "Розничные цены" : "Оптовые цены"}
                        </div>
                        <Button onClick={() => setIsRetail(prev => !prev)}>
                            {isRetail ? "Показать опт" : "Показать розницу"}
                        </Button>
                    </div>

                    <Popconfirm
                        title="Закрыть просмотр результатов?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={onClose}
                    >
                        <Button type="primary">Закрыть</Button>
                    </Popconfirm>
                </div>

                <Tabs items={items}/>
            </div>
        );
    };


    return (
        <MyModal
            isOpen={isOpen}
            onClose={onClose}
            content={renderContent()}
            footer={null}
            width={1280}
        />
    );
};

export default Consent;
