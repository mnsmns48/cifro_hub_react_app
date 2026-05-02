import { Select, InputNumber, Tag } from "antd";

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
                    <div key="value_new">
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            showSearch
                            filterOption={(input, option) =>
                                option.searchText.toLowerCase().includes(input.toLowerCase())
                            }
                            options={attributeValues.map(v => ({
                                label: (
                                    <span style={{ fontSize: 11, lineHeight: "8px" }}>
                                        {v.value}<br />
                                        <span style={{ fontSize: 11, color: "#999", lineHeight: "8px" }}>
                                            {v.alias}
                                        </span>
                                    </span>
                                ),
                                value: v.id,
                                searchText: `${v.value} ${v.alias}`
                            }))}
                            value={newValueMap.attr_value_ids}
                            onChange={(vals) =>
                                setNewValueMap(prev => ({ ...prev, attr_value_ids: vals }))
                            }
                        />
                    </div>
                );
            }

            return <div key={`value_${record.id}`}>{record?.attr_value?.value}</div>;
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
                    <div key="alias_new">
                        <span style={{ color: "#999" }}>Выберите value</span>
                    </div>
                );
            }

            return (
                <div key={`alias_${record.id}`}>
                    {record?.attr_value?.alias || <span style={{ color: "#999" }}>—</span>}
                </div>
            );
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
                    <div key="multiplier_new">
                        <InputNumber
                            value={newValueMap.multiplier}
                            onChange={(val) =>
                                setNewValueMap(prev => ({ ...prev, multiplier: val }))
                            }
                            min={0}
                            step={0.1}
                            style={{ width: "100%" }}
                        />
                    </div>
                );
            }

            return (
                <div key={`multiplier_${record.id}`}>
                    <Tag color="blue">{record.multiplier}</Tag>
                </div>
            );
        }
    }
];
