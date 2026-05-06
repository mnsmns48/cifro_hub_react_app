import {Timeline} from "antd";
import {CheckCircleOutlined, SyncOutlined} from "@ant-design/icons";

export const PriceSyncFlow = ({step}) => {
    return (
        <Timeline
            style={{marginBottom: 20}}
            orientation='horizontal'
            items={[
                {
                    color: step >= 1 ? "green" : "blue",
                    dot: step > 1
                        ? <CheckCircleOutlined style={{fontSize: 16}}/>
                        : <SyncOutlined style={{fontSize: 16}}/>,
                    children: (
                        <div style={{fontSize: 15, fontWeight: step === 1 ? 600 : 400}}>
                            1. Парсинг свежих данных
                        </div>
                    )
                },
                {
                    color: step >= 2 ? "green" : "gray",
                    dot: step >= 2
                        ? <CheckCircleOutlined style={{fontSize: 16}}/>
                        : <SyncOutlined style={{fontSize: 16}}/>,
                    children: (
                        <div style={{fontSize: 15, fontWeight: step === 2 ? 600 : 400}}>
                            2. Выставляем модель и атрибуты
                        </div>
                    )
                },
                {
                    color: step >= 3 ? "green" : "gray",
                    dot: step >= 3
                        ? <CheckCircleOutlined style={{fontSize: 16}}/>
                        : null,
                    children: (
                        <div style={{fontSize: 15, fontWeight: step === 2 ? 600 : 400}}>
                            3. Выбери выгодные модели
                        </div>
                    )
                }
            ]}
        />
    );
};
