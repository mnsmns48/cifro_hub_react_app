import {Button, Popconfirm, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {useEffect, useState} from "react";
import {getProgressLine} from "../PriceUpdater/api.js";
import {startParsing} from "./api.js";
import getComparisonTableColumns from "./ComparisonTableColumns.jsx";
import "./Css/ComparisonModal.css";
import {ExclamationCircleOutlined, MoreOutlined} from "@ant-design/icons";


const ComparisonModal = ({isOpen, onClose, comparisonObj, onConsent, onStepbystep}) => {

    const {vsl_list: vslList} = comparisonObj || {};

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
        if (rows.length > 0) {
            setSelectedRowKeys(rows.map(r => r.id));
        }
    }, [rows]);


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
                    {selectedRowKeys.length > 0 && !isUpdating && !isUpdateFinished && (
                        <Popconfirm
                            title="Запустить обновление?"
                            description="Вы уверены, что хотите запустить обновление?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={handleUpdateClick}
                        >
                            <Button type="primary" danger>
                                <ExclamationCircleOutlined /> Запустить обновление
                            </Button>
                        </Popconfirm>

                    )}
                    {!isUpdating && (
                        <div style={{display: "flex", gap: 10, paddingTop: 10}}>
                            <Button onClick={() => onConsent?.()}
                                    className="comparison-button comparison-active-button">
                                Сверка
                            </Button>

                            <Button className="comparison-button comparison-active-button" icon={<MoreOutlined/>}
                                    onClick={() => onStepbystep?.()}>
                                Пошаговое внедрение изменений
                            </Button>
                        </div>
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
