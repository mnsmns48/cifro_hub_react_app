import {Button, Popconfirm, Spin, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {useEffect, useState} from "react";
import getComparisonTableColumns from "./ComparisonTableColumns.jsx";
import {getProgressLine} from "../PriceUpdater/api.js";
import {consentData, startParsing} from "./api.js";
import ConsentTable from "./ConsentTable.jsx";

const ComparisonModal = ({isOpen, onClose, vslList}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rows, setRows] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateFinished, setIsUpdateFinished] = useState(false);
    const [isInConsentMode, setIsInConsentMode] = useState(false);
    const [consentRows, setConsentRows] = useState([]);
    const [isConsentLoading, setIsConsentLoading] = useState(false);


    useEffect(() => {
        if (Array.isArray(vslList)) {
            const enriched = vslList.map(item => ({
                ...item,
                vsl_id: item.id
            }));
            setRows(enriched);
        }
    }, [vslList]);

    useEffect(() => {
        if (!isUpdating && Object.values(progressMap).length > 0) {
            const allDone = Object.values(progressMap).every(p => p.status === "done");
            if (allDone) {
                setIsUpdateFinished(true);
            }
        }
    }, [progressMap, isUpdating]);

    const handleUpdateClick = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        setIsUpdateFinished(false);

        try {
            const queue = rows.filter(row => selectedRowKeys.includes(row.id));
            for (const row of queue) {
                const {result: progress} = await getProgressLine();

                setRows(prev =>
                    prev.map(r =>
                        r.id === row.id ? {...r, progress_obj: progress} : r
                    )
                );

                setProgressMap(prev => ({
                    ...prev,
                    [row.id]: {status: "pending", percent: 0}
                }));

                const result = await startParsing({
                    progress,
                    vsl_id: row.vsl_id,
                    sync_features: !!row.sync,
                });

                setRows(prev =>
                    prev.map(r =>
                        r.id === row.id
                            ? {
                                ...r,
                                dt_parsed: result.dt_parsed,
                                profit_range_id: result.profit_range_id,
                                duration: result.duration,
                            }
                            : r
                    )
                );
            }
        } catch (e) {
            console.error("Ошибка запуска парсинга:", e);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleConsent = async () => {
        setIsConsentLoading(true);
        setIsInConsentMode(true);

        try {
            const payload = { path_ids: [9, 10] };
            const result = await consentData(payload);
            if (Array.isArray(result)) {
                setConsentRows(result);
            } else {
                console.warn("Некорректный формат ответа:", result);
                setConsentRows([]);
            }
        } catch (e) {
            console.error("Ошибка загрузки данных сверки:", e);
            setConsentRows([]);
        } finally {
            setIsConsentLoading(false);
        }
    };


    const handleBack = () => {
        setIsInConsentMode(false);
    };


    const renderTable = () => {
        if (isInConsentMode) {
            return (
                <div>
                    <div style={{ marginBottom: 12 }}>
                        <Button type="primary" onClick={handleBack}>
                            Назад
                        </Button>
                    </div>

                    {isConsentLoading ? (
                        <div style={{ textAlign: "center", padding: 24 }}>
                            <Spin tip="Загрузка данных сверки..." />
                        </div>
                    ) : consentRows.length === 0 ? (
                        <div style={{ padding: "16px", fontStyle: "italic", color: "#999" }}>
                            Нет данных для сверки
                        </div>
                    ) : (

                        <ConsentTable selectedIds={consentRows} />
                    )}
                </div>
            );
        }


        if (rows.length === 0) {
            return (
                <div style={{padding: "16px", fontStyle: "italic", color: "#999"}}>
                    Нет данных для отображения
                </div>
            );
        }

        return (
            <div>
                <div style={{marginBottom: 12, textAlign: "left"}}>
                    {!isUpdating && !isUpdateFinished && (
                        <Button
                            type="primary"
                            onClick={handleUpdateClick}
                            disabled={selectedRowKeys.length === 0}
                            style={{marginRight: 12}}
                        >
                            Запустить обновление
                        </Button>
                    )}
                    {!isUpdating && (
                        <Button
                            type="primary"
                            onClick={handleConsent}
                            style={{
                                background: "linear-gradient(90deg, #ff4d4f 0%, #ff7a45 100%)",
                                borderColor: "#fb6d6e",
                                boxShadow: "0 0 0 2px rgba(255, 77, 79, 0.3)",
                                fontWeight: "bold"
                            }}
                        >
                            Сверка
                        </Button>
                    )}
                </div>
                <Table
                    columns={getComparisonTableColumns(setRows, progressMap, setProgressMap, isUpdating)}
                    rowKey="id"
                    dataSource={rows}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                        disabled: isUpdating,
                    }}
                    rowClassName={() => (isUpdating ? "disabled-row" : "")}
                />
            </div>
        );
    };


    const renderFooter = () => {
        if (isUpdating) return null;

        return rows.length === 0 ? (
            <Button type="primary" onClick={onClose}>Выход</Button>
        ) : (
            <Popconfirm
                title="Точно закрыть окно?"
                okText="Да"
                cancelText="Нет"
                onConfirm={onClose}
            >
                <Button type="primary">Выход</Button>
            </Popconfirm>
        );
    };

    return (
        <MyModal
            isOpen={isOpen}
            content={renderTable()}
            footer={renderFooter()}
            width={1200}
            key={isInConsentMode ? "consent" : "main"}
        />

    );
};

export default ComparisonModal;
