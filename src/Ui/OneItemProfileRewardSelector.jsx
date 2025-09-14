import {Select, Button, Space, Popconfirm} from "antd";
import {useEffect, useState} from "react";
import {fetchRangeRewardsProfiles} from "../Service-app/Services/RewardRangeSettings/api.js";

const OneItemProfileRewardSelector = ({profit_range, onApplyProfile}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(profit_range?.id ?? null);
    const [pendingId, setPendingId] = useState(null);

    useEffect(() => {
        const loadOptions = async () => {
            setLoading(true);
            try {
                const data = await fetchRangeRewardsProfiles();
                const formatted = data.map(item => ({
                    label: item.title,
                    value: item.id
                }));

                if (profit_range && !formatted.some(opt => opt.value === profit_range.id)) {
                    formatted.unshift({
                        label: profit_range.title,
                        value: profit_range.id
                    });
                }
                setOptions(formatted);
            } catch (error) {
                console.error("Ошибка загрузки профилей:", error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        void loadOptions();
    }, [profit_range]);

    const handleSelectChange = (value) => {
        setPendingId(value);
    };

    const confirmApply = () => {
        if (pendingId) {
            setSelectedId(pendingId);
            onApplyProfile?.(pendingId);
            setPendingId(null);
        }
    };

    const cancelApply = () => {
        setPendingId(null);
    };

    return (
        <Space style={{width: "100%"}}>
            <Select
                value={selectedId}
                style={{flex: 1}}
                loading={loading}
                onChange={handleSelectChange}
                placeholder="Отсутствует"
                options={options}
                allowClear
            />
            {pendingId && (
                <Popconfirm
                    title="Пересчитать цену по выбранному профилю?"
                    onConfirm={confirmApply}
                    onCancel={cancelApply}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button type="primary">Применить</Button>
                </Popconfirm>
            )}
        </Space>
    );
};

export default OneItemProfileRewardSelector;
