import { useState, useEffect } from "react";
import { Segmented, Radio, Card, Space, Typography } from "antd";

const { Text } = Typography;

const CompactFormulaSelector = ({
                                    types = [],
                                    sources = [],
                                    formulas = [],
                                    onChange
                                }) => {
    const [typeId, setTypeId] = useState(null);
    const [source, setSource] = useState(null);
    const [formulaId, setFormulaId] = useState(null);

    // уведомляем родителя
    useEffect(() => {
        onChange?.({ typeId, source, formulaId });
    }, [typeId, source, formulaId]);

    // фильтруем формулы по выбранным typeId + source
    const filteredFormulas = formulas.filter(f =>
        (!typeId || f.type_id === typeId) &&
        (!source || f.source === source)
    );

    return (
        <Card title="Выбор формулы" size="small" style={{ width: 500 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="small">

                {/* Тип товара */}
                <div>
                    <Text strong>Тип товара:</Text>
                    <Segmented
                        block
                        options={types.map(t => ({
                            label: t.title,
                            value: t.id
                        }))}
                        value={typeId}
                        onChange={setTypeId}
                    />
                </div>

                {/* Источник */}
                {typeId && (
                    <div>
                        <Text strong>Источник:</Text>
                        <Segmented
                            block
                            options={sources.map(s => ({
                                label: s,
                                value: s
                            }))}
                            value={source}
                            onChange={setSource}
                        />
                    </div>
                )}

                {/* Формула */}
                {typeId && source && (
                    <div>
                        <Text strong>Формула:</Text>
                        <Radio.Group
                            style={{ width: "100%", marginTop: 8 }}
                            value={formulaId}
                            onChange={e => setFormulaId(e.target.value)}
                        >
                            <Space direction="vertical">
                                {filteredFormulas.map(f => (
                                    <Radio key={f.id} value={f.id}>
                                        {f.name} (ID: {f.id})
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>

                        {filteredFormulas.length === 0 && (
                            <Text type="warning">
                                Нет формул для выбранного типа и источника
                            </Text>
                        )}
                    </div>
                )}
            </Space>
        </Card>
    );
};

export default CompactFormulaSelector;
