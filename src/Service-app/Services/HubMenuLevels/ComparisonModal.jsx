import {Button, Popconfirm, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {useEffect, useState} from "react";
import {getProgressLine} from "../PriceUpdater/api.js";
import {startParsing} from "./api.js";
import getComparisonTableColumns from "./ComparisonTableColumns.jsx";


const ComparisonModal = ({isOpen, onClose, comparisonObj}) => {

    const {
        vsl_list: vslList,
        path_ids: pathIds
    } = comparisonObj || {};

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rows, setRows] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateFinished, setIsUpdateFinished] = useState(false);

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
        alert(JSON.stringify(pathIds, null, 2))
    }


    const renderTable = () => {
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
        />

    );
};


export default ComparisonModal;
