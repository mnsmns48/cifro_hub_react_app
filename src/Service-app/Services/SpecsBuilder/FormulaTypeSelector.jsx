import {Collapse, Spin, Radio, message} from "antd";

const {Panel} = Collapse;

const FormulaTypeSelector = ({
                                 currentFormulaName,
                                 typesLoading,
                                 types,
                                 selected,
                                 setSelected,
                                 typesError,
                                 updateFormulaLink,
                                 onUpdated
                             }) => {

    const panelHeader = currentFormulaName
        ? `Формула выбрана: ${currentFormulaName}`
        : <span style={{color: "red"}}>Формула не выбрана</span>;

    const handleSelect = async (id) => {
        setSelected(id);
        const typeObj = types.find(t => t.id === id);
        const res = await updateFormulaLink({
            id: typeObj.id,
            name: typeObj.title_type
        });
        if (res) {
            onUpdated(typeObj.title_type);
        }
    };

    return (
        <div style={{padding: 20}}>
            <Collapse defaultActiveKey={["1"]}>
                <Panel header={panelHeader} key="1">
                    {typesError && <>Ошибка: {typesError}</>}
                    {typesLoading ? (
                        <Spin/>
                    ) : (
                        <>
                            <div style={{marginBottom: 10}}>
                                Выберите тип формулы:
                            </div>

                            <Radio.Group
                                onChange={(e) => handleSelect(e.target.value)}
                                value={selected}
                                style={{display: "flex", flexDirection: "column", gap: 8}}
                            >
                                {types.map(t => (
                                    <Radio key={t.id} value={t.id}>
                                        <div style={{fontWeight: 600}}>
                                            {t.title_type}
                                        </div>
                                        {t.description && (
                                            <div style={{fontSize: 12, color: "#888"}}>
                                                {t.description}
                                            </div>
                                        )}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </>
                    )}
                </Panel>
            </Collapse>
        </div>
    );
};

export default FormulaTypeSelector;