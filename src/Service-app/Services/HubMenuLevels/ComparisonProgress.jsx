import { Progress } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";

const ComparisonProgress = ({ status, percent = 0 }) => {
    switch (status) {
        case "pending":
            return (
                <span style={{ color: "#999", display: "flex", alignItems: "center", gap: 6 }}>
                    <ClockCircleOutlined />
                    Ожидает обновления
                </span>
            );
        case "in_progress":
            return <Progress strokeLinecap="butt" percent={percent} size="small" />;
        case "done":
            return (
                <span style={{ color: "#52c41a", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleOutlined />
                    Готово
                </span>
            );
        default:
            return null;
    }
};

export default ComparisonProgress;
