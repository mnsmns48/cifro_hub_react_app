import { Empty } from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";

const EmptyState = () => (
    <div
        style={{
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
        }}
    >
        <Empty
            image={
                <div
                    style={{
                        width: 82,
                        height: 82,
                        borderRadius: "50%",
                        backgroundColor: "#3a3a3a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    <CloseCircleOutlined style={{fontSize: 50, color: "#e2fc2a"}}/>
                </div>
            }
            description={
                <div
                    style={{
                        fontSize: 16,
                        color: "#3a3a3a",
                        textAlign: "center",
                    }}
                >
                    Нет данных в этой таблице
                </div>
            }
        />
    </div>
);

export default EmptyState;
