import {Select, Space} from "antd";
import {useState, useEffect} from "react";

const OneItemProfileRewardSelector = ({profit_range, profit_profiles, onApplyProfile}) => {
    const [options, setOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(profit_range?.id ?? null);

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

    useEffect(() => {
        setSelectedId(profit_range?.id ?? null);
    }, [profit_range?.id]);

    const handleSelectChange = (value) => {
        setSelectedId(value);
        onApplyProfile?.(value);
    };

    return (
        <Space>
            <Select
                value={selectedId}
                onChange={handleSelectChange}
                placeholder="Отсутствует"
                options={options}
            />
        </Space>
    );
};

export default OneItemProfileRewardSelector;
