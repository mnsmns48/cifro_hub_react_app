import {Button, Popconfirm, Table, Modal} from "antd";
import {useEffect, useMemo, useState} from "react";
import {getProgressLine} from "../PriceUpdater/api.js";
import {startParsing} from "./api.js";
import getComparisonTableColumns from "./VslUpdateTableColumns.jsx";
import "./Css/VslUpdate.css";
import {DashboardOutlined, OrderedListOutlined} from "@ant-design/icons";

const VslUpdateComponent = ({isOpen, onClose, priceSyncList, onStepbystep}) => {

    const vslList = useMemo(() => {
        if (!Array.isArray(priceSyncList)) return [];
        const all = priceSyncList.flatMap(item => item.vsl_list || []);
        const seen = new Set();
        const unique = [];
        for (const vsl of all) {
            if (!seen.has(vsl.id)) {
                seen.add(vsl.id);
                unique.push(vsl);
            }
        }
        return unique;
    }, [priceSyncList]);


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rows, setRows] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateFinished, setIsUpdateFinished] = useState(false);

    useEffect(() => {
        if (Array.isArray(vslList)) {
            const enriched = vslList.map(item => ({...item, vsl_id: item.id}));
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

    return (
        <Modal open={isOpen}
               onCancel={onClose}
               footer={null}
               width={1200}
               closable={false}
               maskClosable={false}
        >
            {rows.length === 0 ? (
                <div style={{padding: "16px", fontStyle: "italic", color: "#999"}}>
                    Нет данных для отображения
                </div>
            ) : (
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6
                        }}
                    >
                        <div style={{display: "flex", gap: 8}}>
                            {selectedRowKeys.length > 0 && !isUpdating && !isUpdateFinished && (
                                <Popconfirm
                                    title="Запустить обновление?"
                                    description="Вы уверены, что хотите запустить обновление?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={handleUpdateClick}
                                >
                                    <Button color="purple" variant="solid">
                                        <DashboardOutlined/> Запустить парсинг
                                    </Button>
                                </Popconfirm>
                            )}

                            {!isUpdating && (
                                <Button className="comparison-button comparison-active-button"
                                        icon={<OrderedListOutlined/>}
                                        onClick={() => onStepbystep?.()}
                                >
                                    Пошаговое обновление
                                </Button>
                            )}
                        </div>
                        <div style={isUpdating ? {pointerEvents: "none", opacity: 0.6} : {}}>
                            <Popconfirm title="Точно закрыть окно?"
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={onClose}
                            >
                                <Button type="primary">Выход</Button>
                            </Popconfirm>
                        </div>
                    </div>

                    <Table
                        columns={getComparisonTableColumns(setRows, progressMap, setProgressMap, isUpdating)}
                        rowKey="id"
                        size="small"
                        dataSource={rows}
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                            disabled: isUpdating,
                        }}
                        rowClassName={() => (isUpdating ? "disabled-row" : "")}
                        style={isUpdating ? {pointerEvents: "none", opacity: 0.6} : {}}
                    />
                </div>
            )}
        </Modal>
    );
}

export default VslUpdateComponent;
