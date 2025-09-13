import {Select} from "antd";
import {useEffect, useState} from "react";
import {fetchRangeRewardsProfiles} from "../Service-app/Services/RewardRangeSettings/api.js";


const OneItemProfileRewardSelector = ({profit_range, onChange}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(profit_range?.id ?? null);

    useEffect(() => {
        setSelectedValue(profit_range?.id ?? null);
    }, [profit_range]);


    useEffect(() => {
        const loadInitialOptions = async () => {
            setLoading(true);
            try {
                const data = await fetchRangeRewardsProfiles();
                const formatted = data.map((item) => ({
                    label: item.title,
                    value: item.id,
                }));

                if (
                    profit_range &&
                    !formatted.some((opt) => opt.value === profit_range.id)
                ) {
                    formatted.unshift({
                        label: profit_range.title,
                        value: profit_range.id,
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

        void loadInitialOptions();
    }, [profit_range]);

    const handleChange = (value) => {
        setSelectedValue(value);
        onChange?.(value);
    };

    return (
        <Select
            value={selectedValue}
            style={{width: "100%"}}
            loading={loading}
            onChange={handleChange}
            placeholder="Отсутствет"
            options={options}
            allowClear
        />
    );
};

export default OneItemProfileRewardSelector;