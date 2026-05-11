import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {Timeline} from "antd";

export const PriceSyncFlow = ({step}) => {

    const getStatus = (currentStep) => {
        if (step === currentStep) {
            return {
                color: "#edcb16",
                dot: <LoadingOutlined style={{fontSize: 20}}/>,
                textStyle: {
                    fontSize: 15,
                    fontWeight: 600,
                    opacity: 1
                }
            };
        }
        if (step > currentStep) {
            return {
                color: "green",
                dot: <CheckCircleOutlined style={{fontSize: 20}}/>,
                textStyle: {
                    fontSize: 15,
                    fontWeight: 400,
                    opacity: 0.4
                }
            };
        }

        return {
            color: "gray",
            dot: null,
            textStyle: {
                fontSize: 15,
                fontWeight: 400,
                opacity: 1
            }
        };
    };

    return (
        <Timeline
            style={{marginBottom: 20}}
            orientation="horizontal"
            mode="alternate"
            items={[
                {
                    ...getStatus(1),
                    children: (
                        <div style={getStatus(1).textStyle}>
                            1. Парсинг свежих данных
                        </div>
                    )
                },
                {
                    ...getStatus(2),
                    children: (
                        <div style={getStatus(2).textStyle}>
                            2. Выставляем модель и атрибуты
                        </div>
                    )
                },
                {
                    ...getStatus(3),
                    children: (
                        <div style={getStatus(3).textStyle}>
                            3. Выбери выгодные модели
                        </div>
                    )
                }
            ]}
        />
    );
};
