import {Select, InputNumber, Tag} from "antd";

export const getAnalyticsValueMapColumns = ({
                                                isCreatingValueMapLine,
                                                attributeValues,
                                                newValueMap,
                                                setNewValueMap
                                            }) => [
    {
        title: "Value",
        key: "value",
        align: "center",
        width: "40%",
        render: (text, record, index) => {
            if (isCreatingValueMapLine && index === 0) {
                return (
                    <Select mode="multiple"
                            style={{width: "100%"}}
                            showSearch
                            filterOption={(input, option) =>
                                option.searchText.toLowerCase().includes(input.toLowerCase())
                            }
                            options={attributeValues.map(v => ({
                                label: (
                                    <span>
                                    {v.value}<br/>
                                    <span style={{fontSize: 11, color: "#999"}}>{v.alias}</span>
                                </span>
                                ),
                                value: v.id,
                                searchText: `${v.value} ${v.alias}`
                            }))}
                            value={newValueMap.attr_value_ids}
                            onChange={(vals) =>
                                setNewValueMap(prev => ({...prev, attr_value_ids: vals}))
                            }
                    />

                );
            }
            return record?.attr_value?.value;
        }
    },
    {
        title: "Alias",
        key: "alias",
        align: "center",
        width: "40%",
        render: (text, record, index) => {
            if (isCreatingValueMapLine && index === 0) {
                return (
                    <span style={{color: "#999"}}>
                        Выберите value
                    </span>
                );
            }

            return record?.attr_value?.alias || <span style={{color: "#999"}}>—</span>;
        }
    },
    {
        title: "Multiplier",
        key: "multiplier",
        align: "center",
        width: "20%",
        render: (text, record, index) => {
            if (isCreatingValueMapLine && index === 0) {
                return (
                    <InputNumber
                        value={newValueMap.multiplier}
                        onChange={(val) =>
                            setNewValueMap(prev => ({...prev, multiplier: val}))
                        }
                        min={0}
                        step={0.1}
                        style={{width: "100%"}}
                    />
                );
            }

            return <Tag color="blue">{record.multiplier}</Tag>;
        }
    }
];
