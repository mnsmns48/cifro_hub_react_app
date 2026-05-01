import {Button, Descriptions, Input, InputNumber, message, Popconfirm, Select, Space, Switch, Tag} from "antd";
import {DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined} from "@ant-design/icons";


export const getAnalyticsColumns = ({
                                        isCreatingRuleLine,
                                        isEditingRuleId,
                                        productTypes,
                                        attributes,
                                        newRule,
                                        setNewRule,
                                        editRule,
                                        setEditRule,
                                        handleEditStart,
                                        handleDeleteRule,
                                        handleUpdateRuleLine,
                                        handleSaveRuleLine,
                                        handleUndo,
                                        handleToggleSwitch
                                    }) => {

    const isNewRow = (record) => isCreatingRuleLine && !record.id;
    const isEditRow = (record) => isEditingRuleId === record.id;

    const columns = [
        {
            title: "Тип товара",
            key: "product_type",
            align: "center",
            width: "15%",
            render: (_, record) => {
                const isNew = isNewRow(record);
                const isEdit = isEditRow(record);

                if (isNew || isEdit) {
                    const value = isNew ? newRule.product_type_id : editRule.product_type_id;
                    const onChange = isNew
                        ? (v) => setNewRule(prev => ({...prev, product_type_id: v}))
                        : (v) => setEditRule(prev => ({...prev, product_type_id: v}));

                    return (
                        <Select
                            style={{width: "100%"}}
                            options={productTypes.map(pt => ({
                                label: pt.type,
                                value: pt.id
                            }))}
                            value={value}
                            onChange={onChange}
                        />
                    );
                }

                return record.product_type?.type;
            }
        },
        {
            title: "Атрибут",
            key: "attr_key",
            align: "center",
            width: "18%",
            render: (_, record) => {
                const isNew = isNewRow(record);
                const isEdit = isEditRow(record);

                if (isNew || isEdit) {
                    const value = isNew ? newRule.attr_key_id : editRule.attr_key_id;

                    const onChange = (v) => {
                        if (isNew) {
                            setNewRule(prev => ({...prev, attr_key_id: v}));
                        } else {
                            if (v !== editRule.attr_key_id) {
                                void message.open({
                                    type: "warning",
                                    content: (
                                        <span style={{color: "#ff4d4f", fontWeight: 500}}>
                                            Внимание!<br/>
                                            При смене атрибута связанные Value Maps будут удалены
                                        </span>
                                    ),
                                    style: {color: "#c38428", fontSize: 22, fontWeight: "bold"},
                                    duration: 10
                                });

                            }
                            setEditRule(prev => ({...prev, attr_key_id: v}));
                        }
                    };

                    return (
                        <Select
                            style={{width: "100%"}}
                            options={attributes.map(k => ({
                                label: k.key,
                                value: k.id
                            }))}
                            value={value}
                            onChange={onChange}
                        />
                    );
                }

                return record.attr_key?.key;
            }
        },
        {
            title: "Вес",
            key: "weight",
            align: "center",
            width: "7%",
            render: (_, record) => {
                if (isCreatingRuleLine && !record.id) {
                    return (
                        <InputNumber
                            style={{width: "100%"}}
                            value={newRule.weight}
                            onChange={(v) => setNewRule(prev => ({...prev, weight: v}))}
                        />
                    );
                }

                if (isEditRow(record)) {
                    return (
                        <InputNumber
                            style={{width: "100%"}}
                            value={editRule.weight}
                            onChange={(v) => setEditRule(prev => ({...prev, weight: v}))}
                        />
                    );
                }

                return record.weight;
            }
        },
        {
            title: "Описание",
            key: "description",
            align: "center",
            width: "30%",
            render: (_, record) => {
                const isNew = isCreatingRuleLine && !record.id;
                const isEdit = isEditingRuleId === record.id;

                if (isNew) {
                    return (
                        <Input
                            value={newRule.description}
                            onChange={(e) =>
                                setNewRule(prev => ({...prev, description: e.target.value}))
                            }
                        />
                    );
                }

                if (isEdit) {
                    return (
                        <Input
                            value={editRule.description}
                            onChange={(e) =>
                                setEditRule(prev => ({...prev, description: e.target.value}))
                            }
                        />
                    );
                }

                return record.description;
            }
        },
        {
            title: "Активно",
            key: "is_enabled",
            align: "center",
            width: "10%",
            render: (_, record) => {
                if ((isCreatingRuleLine && !record.id) || isEditingRuleId === record.id) {
                    return null;
                }

                return (
                    <Switch
                        checked={record.is_enabled}
                        onChange={(v) => handleToggleSwitch(record.id, v)}
                    />
                );
            }
        },
        {
            key: "actions",
            width: "6%",
            align: "center",
            render: (_, record) => {
                const isNew = isCreatingRuleLine && !record.id;
                const isEdit = isEditingRuleId === record.id;

                if (isNew) {
                    return (
                        <Space>
                            <Button size="small" icon={<SaveOutlined/>} onClick={() => handleSaveRuleLine(newRule)}/>
                            <Button size="small" icon={<UndoOutlined/>} onClick={handleUndo}/>
                        </Space>
                    );
                }

                if (isEdit) {
                    return (
                        <Space>
                            <Button size="small" icon={<SaveOutlined/>} onClick={() => handleUpdateRuleLine(editRule)}/>
                            <Button size="small" icon={<UndoOutlined/>} onClick={handleUndo}/>
                        </Space>
                    );
                }

                return (
                    <Space>
                        <Button
                            size="small"
                            icon={<EditOutlined/>}
                            onClick={async () => await handleEditStart(record)}
                        />

                        <Popconfirm
                            title="Удалить правило?"
                            description="Это действие нельзя отменить"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => handleDeleteRule(record.id)}
                        >
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ]

    if (!isCreatingRuleLine) {
        columns.splice(3, 0, {
            title: "Value Maps",
            key: "value_maps",
            align: "center",
            width: "20%",
            render: (_, record) => {
                const maps = record.value_maps;
                if (!maps?.length) return "";

                return (
                    <Descriptions size="small"
                                  column={1}
                                  bordered={false}
                                  style={{margin: 0}}
                    >
                        {maps.map((vm) => (
                            <Descriptions.Item key={vm.id}
                                               label={vm.attr_value.alias || vm.attr_value.value}
                            >
                                <Tag color="blue">{vm.multiplier}</Tag>
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                );
            }
        });
    }


    return columns;
}