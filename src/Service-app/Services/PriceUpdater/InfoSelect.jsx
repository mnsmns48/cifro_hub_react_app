import {Select, Typography} from "antd";


const {Text} = Typography;
const {Option} = Select;

const InfoSelect = ({titles, record, setRows}) => {
    if (!Array.isArray(titles) || titles.length === 0) {
        return (
            <Text type="danger" strong> ?? </Text>
        );
    }

    const selected = record.feature_selected ?? undefined;

    const onChange = value => {
        setRows(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(r => r.origin === record.origin);
            if (idx !== -1) {
                copy[idx] = {...copy[idx], feature_selected: value};
            }
            return copy;
        });
    };
    if (titles.length === 1) {
        return <Text>{titles[0]}</Text>;
    }

    return (
        <Select
            style={{width: "100%"}}
            value={selected}
            placeholder="Выберите вариант"
            showSearch
            optionFilterProp="children"
            onChange={onChange}
        >
            {titles.map(title => (
                <Option key={title} value={title}>
                    {title}
                </Option>
            ))}
        </Select>
    );
};


export default InfoSelect;
