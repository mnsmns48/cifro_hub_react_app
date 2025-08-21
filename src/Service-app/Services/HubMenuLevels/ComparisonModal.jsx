import {Button, Popconfirm, Table} from "antd";
import MyModal from "../../../Ui/MyModal.jsx";
import {useState} from "react";
import getComparisonTableColumns from "./ComparisonTableColumns.jsx";


const ComparisonModal = ({ isOpen, onClose, content }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const dataSource = content
        ? Object.entries(content).map(([url, { title, dt_parsed }], idx) => ({
            key: idx,
            url,
            title,
            dt_parsed,
        }))
        : [];

    const handleUpdateClick = async () => {
        const selectedRows = dataSource.filter(item => selectedRowKeys.includes(item.key));

    };

    const renderTable = () => {
        if (dataSource.length === 0) {
            return (
                <div style={{ padding: "16px", fontStyle: "italic", color: "#999" }}>
                    Нет данных для отображения
                </div>
            );
        }

        return (
            <div>
                <div style={{marginBottom: 12, textAlign: "left"}}>
                    <Button type="primary" onClick={handleUpdateClick}
                            disabled={selectedRowKeys.length === 0} style={{ marginRight: 12 }}>Запустить обновление</Button>
                    <Button type="primary">Сверка</Button>
                </div>
                {dataSource.length === 0 ? (
                    <div style={{padding: "16px", color: "#999"}}>
                        Нет данных для отображения
                    </div>
                ) : (
                    <Table
                        columns={getComparisonTableColumns()}
                        dataSource={dataSource}
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
                <Popconfirm title="Точно закрыть окно?" okText="Да" cancelText="Нет" onConfirm={onClose} onCancel={onClose}>
                    <Button type="primary">Выход</Button>
                </Popconfirm>
            }
            width={1200}
        />
    );
};

export default ComparisonModal;
