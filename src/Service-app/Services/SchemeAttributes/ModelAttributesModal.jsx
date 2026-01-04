import {useEffect, useState} from "react";
import {Modal, Select} from "antd";

const ModelAttributesModal = ({open, onClose, data, onUpdated}) => {
    const [selectedValues, setSelectedValues] = useState({});

    useEffect(() => {
        if (!data) return;

        const map = {};
        data.model_attribute_values_exists.forEach(key => {
            map[key.key_id] = key.attr_value_ids.map(v => v.id);
        });
        setSelectedValues(map);
    }, [data]);

    if (!data) return null;

    const handleValueChange = async (keyId, newValues) => {
        const oldValues = selectedValues[keyId] || [];

        const added = newValues.filter(v => !oldValues.includes(v));
        const removed = oldValues.filter(v => !newValues.includes(v));

        setSelectedValues(prev => ({
            ...prev,
            [keyId]: newValues
        }));

        const payloadBase = {
            model_ids: data.model_ids
        };

        for (const valueId of added) {
            await fetch("/service/attributes/add_product_attribute_value_option_link", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...payloadBase,
                    attribute_value_id: valueId
                })
            });
        }

        for (const valueId of removed) {
            await fetch("/service/attributes/delete_product_attribute_value_option_link", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...payloadBase,
                    attribute_value_id: valueId
                })
            });
        }

        if (onUpdated) {
            onUpdated();
        }
    };


    return (
        <Modal open={open} onCancel={onClose} footer={null} width={600}>
            <div style={{display: "flex", flexDirection: "column", gap: 24}}>

                <div>
                    {data.titles.map((t, i) => (
                        <div key={i}>{t}</div>
                    ))}
                </div>

                {data.model_attribute_values.map((key) => (
                    <div key={key.key_id} style={{display: "flex", flexDirection: "column", gap: 8}}>
                        <div style={{fontWeight: 500}}>
                            {key.key}
                        </div>

                        <Select mode="multiple"
                                showSearch
                                style={{width: "100%"}}
                                placeholder={`Выберите значения для ${key.key}`}
                                value={selectedValues[key.key_id] || []}
                                onChange={(vals) => handleValueChange(key.key_id, vals)}
                                filterOption={(input, option) => {
                                    const label =
                                        option?.label ??
                                        option?.children?.props?.children?.join?.(" ") ??
                                        "";
                                    return label.toLowerCase().includes(input.toLowerCase());
                                }}
                        >
                            {key.attr_value_ids.map(v => (
                                <Select.Option key={v.id}
                                               value={v.id}
                                               label={v.alias ? `${v.value} ${v.alias}` : v.value}
                                >
                                    <div style={{display: "flex", gap: 6}}>
                                        <span>{v.value}</span>
                                        {v.alias && <span style={{color: "#999"}}>{v.alias}</span>}
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>

                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default ModelAttributesModal;
