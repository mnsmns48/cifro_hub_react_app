import {Button, Descriptions, Input, InputNumber, message, Popconfirm, Select, Space, Switch, Tag} from "antd";
import {
    DashOutlined,
    DeleteOutlined,
    EditOutlined, PlusSquareOutlined,
    SaveOutlined,
    UndoOutlined
} from "@ant-design/icons";


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
                                        handleToggleSwitch,
                                        handleOpenValueMapModal
                                    }) => {

    const isNewRow = (record) => record.id === "__new_rule_line";
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
                        <div key="product_type">
                            <Select
                                style={{width: "100%"}}
                                options={productTypes.map(pt => ({
                                    label: pt.type,
                                    value: pt.id
                                }))}
                                value={value}
                                onChange={onChange}
                            />
                        </div>
                    );
                }

                return <div key="product_type_text">{record.product_type?.type}</div>;
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
                        if (!isNew && v !== editRule.attr_key_id) {
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

                        isNew
                            ? setNewRule(prev => ({...prev, attr_key_id: v}))
                            : setEditRule(prev => ({...prev, attr_key_id: v}));
                    };

                    return (
                        <div key="attr_key">
                            <Select
                                style={{width: "100%"}}
                                options={attributes.map(k => ({
                                    label: k.key,
                                    value: k.id
                                }))}
                                value={value}
                                onChange={onChange}
                            />
                        </div>
                    );
                }

                return <div key="attr_key_text">{record.attr_key?.key}</div>;
            }
        },

        {
            title: "Вес",
            key: "weight",
            align: "center",
            width: "7%",
            render: (_, record) => {
                const isNew = isNewRow(record);
                const isEdit = isEditRow(record);

                if (isNew) {
                    return (
                        <div key="weight_new">
                            <InputNumber
                                style={{width: "100%"}}
                                value={newRule.weight}
                                onChange={(v) => setNewRule(prev => ({...prev, weight: v}))}
                            />
                        </div>
                    );
                }

                if (isEdit) {
                    return (
                        <div key="weight_edit">
                            <InputNumber
                                style={{width: "100%"}}
                                value={editRule.weight}
                                onChange={(v) => setEditRule(prev => ({...prev, weight: v}))}
                            />
                        </div>
                    );
                }

                return <div key="weight_text">{record.weight}</div>;
            }
        },

        {
            title: "Описание",
            key: "description",
            align: "center",
            width: "30%",
            render: (_, record) => {
                const isNew = isNewRow(record);
                const isEdit = isEditRow(record);

                if (isNew) {
                    return (
                        <div key="desc_new">
                            <Input
                                value={newRule.description}
                                onChange={(e) =>
                                    setNewRule(prev => ({...prev, description: e.target.value}))
                                }
                            />
                        </div>
                    );
                }

                if (isEdit) {
                    return (
                        <div key="desc_edit">
                            <Input
                                value={editRule.description}
                                onChange={(e) =>
                                    setEditRule(prev => ({...prev, description: e.target.value}))
                                }
                            />
                        </div>
                    );
                }

                return <div key="desc_text">{record.description}</div>;
            }
        },

        {
            title: "Активно",
            key: "is_enabled",
            align: "center",
            width: "10%",
            render: (_, record) => {
                const isNew = isNewRow(record);
                const isEdit = isEditRow(record);

                if (isNew || isEdit) {
                    return <div key="switch_empty"/>;
                }

                return (
                    <div key="switch">
                        <Switch
                            checked={record.is_enabled}
                            onChange={(v) => handleToggleSwitch(record.id, v)}
                        />
                    </div>
                );
            }
        },

        {
            key: "actions",
            width: "6%",
            align: "center",
            render: (_, record) => {
                const isNew = isNewRow(record);
                const isEdit = isEditRow(record);

                if (isNew) {
                    return (
                        <div key="actions_new">
                            <Space>
                                <Button size="small" icon={<SaveOutlined/>}
                                        onClick={() => handleSaveRuleLine(newRule)}/>
                                <Button size="small" icon={<UndoOutlined/>} onClick={handleUndo}/>
                            </Space>
                        </div>
                    );
                }

                if (isEdit) {
                    return (
                        <div key="actions_edit">
                            <Space>
                                <Button size="small" icon={<SaveOutlined/>}
                                        onClick={() => handleUpdateRuleLine(editRule)}/>
                                <Button size="small" icon={<UndoOutlined/>} onClick={handleUndo}/>
                            </Space>
                        </div>
                    );
                }

                return (
                    <div key="actions_default">
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
                                <Button danger size="small" icon={<DeleteOutlined/>}/>
                            </Popconfirm>
                        </Space>
                    </div>
                );
            }
        }
    ];


    if (!isCreatingRuleLine) {
        columns.splice(3, 0, {
                title: "Value Maps",
                key: "value_maps",
                align: "center",
                width: "20%",
                render: (_, record) => {
                    const maps = record.value_maps;

                    return (
                        <div
                            style={{cursor: "pointer"}}
                            onClick={() => handleOpenValueMapModal(record)}
                        >
                            {maps?.length ? (
                                <Descriptions
                                    size="small"
                                    column={1}
                                    bordered={false}
                                    style={{margin: 0}}
                                >
                                    {maps.map((vm) => (
                                        <Descriptions.Item
                                            key={vm.id}
                                            label={
                                                <span style={{display: "inline-block", lineHeight: 1.2}}>
                                                    {vm.attr_value.value}
                                                    <br/>
                                                    <span style={{color: "#999", fontSize: 13}}>
                                                        {vm.attr_value.alias}
                                                    </span>
                                            </span>}>
                                            <Tag color="blue">{vm.multiplier}</Tag>
                                        </Descriptions.Item>
                                    ))}
                                </Descriptions>
                            ) : (
                                <span style={{color: "#999"}}><PlusSquareOutlined/> <DashOutlined/></span>
                            )}
                        </div>
                    );
                }
            }
        );
    }


    return columns;
}