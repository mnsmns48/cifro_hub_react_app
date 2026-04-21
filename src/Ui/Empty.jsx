import {Empty} from "antd";

const EmptyState = () => (
    <div style={{ padding: 40 }}>
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span style={{ fontSize: 14, color: "#666" }}>
                    Таблица пуста
                </span>
            }
        />
    </div>
);

export default EmptyState;
