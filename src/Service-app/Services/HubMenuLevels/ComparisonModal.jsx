import {Button, Popconfirm, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {useEffect, useMemo, useState} from "react";
import getComparisonTableColumns from "./ComparisonTableColumns.jsx";
import {getProgressLine} from "../PriceUpdater/api.js";


const ComparisonModal = ({isOpen, onClose, vslList}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rows, setRows] = useState([]);
    const [progressLineObj, setProgressLineObj] = useState("");

    useEffect(() => {
        if (Array.isArray(vslList)) {
            setRows(vslList.map(item => ({...item})));
        }
    }, [vslList]);


    const handleUpdateClick = async () => {
        const {result: progress} = await getProgressLine();
        setProgressLineObj(progress);

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
                    <Button type="primary" onClick={handleUpdateClick}
                            disabled={selectedRowKeys.length === 0} style={{marginRight: 12}}>Запустить
                        обновление</Button>
                    <Button type="primary">Сверка</Button>
                </div>
                {rows.length === 0 ? (
                    <div style={{padding: "16px", color: "#999"}}>
                        Нет данных для отображения
                    </div>
                ) : (
                    <Table
                        columns={getComparisonTableColumns(setRows)}
                        rowKey="id"
                        dataSource={rows}
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                        }}
                    />
                )}
            </div>
        );
    };

    return (
        <MyModal
            isOpen={isOpen}
            content={renderTable()}
            footer={
                rows.length === 0 ? (
                    <Button type="primary" onClick={onClose}>Выход</Button>
                ) : (
                    <Popconfirm
                        title="Точно закрыть окно?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={onClose}
                        onCancel={onClose}
                    >
                        <Button type="primary">Выход</Button>
                    </Popconfirm>
                )
            }
            width={1200}
        />
    );
};

export default ComparisonModal;
