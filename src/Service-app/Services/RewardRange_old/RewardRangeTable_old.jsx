import { Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const RewardRangeTable_old = ({ selectedProfile, onDelete, isAdding }) => {
    let dataSource = selectedProfile.lines || [];

    // ✅ Добавляем временную строку, если активен режим добавления
    if (isAdding) {
        dataSource = [...dataSource, { id: "new", line_from: "", line_to: "", is_percent: false, reward: "" }];
    }

    const columns = [
        { title: "От", dataIndex: "line_from", key: "line_from", width: 200 },
        { title: "До", dataIndex: "line_to", key: "line_to", width: 200 },
        { title: "Это процент?", dataIndex: "is_percent", key: "is_percent", render: (val) => (val ? "✅ Да" : "❌ Нет"), width: 200 },
        { title: "Вознаграждение", dataIndex: "reward", key: "reward", width: 200 },
        {
            title: "Действия",
            key: "action",
            width: 150,
            render: (_, record) =>
                record.id !== "new" ? (
                    <Button icon={<DeleteOutlined />} type="danger" onClick={() => onDelete(record.id)} />
                ) : null
        }
    ];

    return (
        <div style={{ padding: "20px", margin: "0 auto" }}>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                bordered
            />
        </div>
    );
};

export default RewardRangeTable_old;
