import {Select, Button, Space, Popconfirm} from "antd";
import {useState, useEffect} from "react";

const OneItemProfileRewardSelector = ({profit_range, profit_profiles, onApplyProfile}) => {
    const [options, setOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(profit_range?.id ?? null);
    const [pendingId, setPendingId] = useState(null);

    useEffect(() => {
        const formatted = profit_profiles.map(item => ({
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
    }, [profit_profiles, profit_range]);

    const handleSelectChange = (value) => {
        setPendingId(value);
    };

    const confirmApply = () => {
        if (pendingId !== null) {
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
                onChange={handleSelectChange}
                placeholder="Отсутствует"
                options={options}
                allowClear
            />
            {pendingId !== null && (
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
