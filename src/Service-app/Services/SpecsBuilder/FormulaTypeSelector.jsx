import {Collapse, Spin, Radio} from "antd";

const {Panel} = Collapse;

const FormulaTypeSelector = ({
                                 currentFormulaName,
                                 typesLoading,
                                 types,
                                 selectedEntityType,
                                 setSelectedEntityType,
                                 typesError,
                                 updateFormulaLink,
                                 onUpdated
                             }) => {

    const panelHeader = currentFormulaName
        ? `Формула выбрана: ${currentFormulaName}`
        : <span style={{color: "red"}}>Формула не выбрана</span>;

    const handleSelect = async (id) => {
        setSelectedEntityType(id);
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
        <div>
            <Collapse bordered={false} ghost={true}>
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
                                value={selectedEntityType}
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