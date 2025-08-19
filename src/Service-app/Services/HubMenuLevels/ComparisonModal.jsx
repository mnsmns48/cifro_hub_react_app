import { Table } from "antd";
import MyModal from "../../../Ui/MyModal.jsx";

const ComparisonModal = ({ isOpen, onClose, content }) => {
    const columns = [
        {
            dataIndex: "index",
            key: "index",
            width: 60,
        },
        {
            dataIndex: "value",
            key: "value",
            render: (text) => <span style={{ wordBreak: "break-word" }}>{text}</span>,
        },
    ];

    const dataSource = Array.isArray(content)
        ? content.map((item, idx) => ({
            key: idx,
            index: idx + 1,
            value: item,
        }))
        : [];

    const renderTable = () => {
        if (dataSource.length === 0) {
            return <div style={{ padding: "16px", fontStyle: "italic", color: "#999" }}>Нет данных для отображения</div>;
        }

        return <Table columns={columns} dataSource={dataSource} pagination={false} />;
    };

    return (
        <MyModal
            isOpen={isOpen}
            onConfirm={onClose}
            onCancel={onClose}
            content={renderTable()}
            footer={null}
        />
    );
};

export default ComparisonModal;
