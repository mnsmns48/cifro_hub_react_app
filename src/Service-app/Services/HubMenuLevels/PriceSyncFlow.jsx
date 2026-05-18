import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Timeline } from "antd";

export const PriceSyncFlow = ({ step }) => {

    const getStatus = (currentStep) => {
        const isCurrent = step === currentStep;
        const isDone = step > currentStep;

        return {
            color: isCurrent ? "#edcb16" : isDone ? "green" : "gray",
            icon: isCurrent
                ? <LoadingOutlined style={{ fontSize: 20 }} />
                : isDone
                    ? <CheckCircleOutlined style={{ fontSize: 20 }} />
                    : null,
            textStyle: {
                fontSize: 15,
                fontWeight: isCurrent ? 600 : 400,
                opacity: isDone ? 0.4 : 1
            }
        };
    };

    return (
        <Timeline
            style={{ marginBottom: 20 }}
            orientation="horizontal"
            mode="alternate"
            items={[
                {
                    color: getStatus(1).color,
                    icon: getStatus(1).icon,
                    content: (
                        <div style={getStatus(1).textStyle}>
                            1. Парсинг свежих данных
                        </div>
                    )
                },
                {
                    color: getStatus(2).color,
                    icon: getStatus(2).icon,
                    content: (
                        <div style={getStatus(2).textStyle}>
                            2. Выставляем модель и атрибуты
                        </div>
                    )
                },
                {
                    color: getStatus(3).color,
                    icon: getStatus(3).icon,
                    content: (
                        <div style={getStatus(3).textStyle}>
                            3. Выбери выгодные модели
                        </div>
                    )
                },
                {
                    color: getStatus(4).color,
                    icon: getStatus(4).icon,
                    content: (
                        <div style={getStatus(4).textStyle}>
                            4. Выбираем отдельные позиции
                        </div>
                    )
                }
            ]}
        />
    );
};
