import {useEffect, useState} from "react";
import {fetchGetData} from "./Common/api.js";
import {Spin} from "antd";
import {useFormulaTypeSelector} from "./SpecsBuilder/useFormulaTypeSelector.js";
import FormulaTypeSelector from "./SpecsBuilder/FormulaTypeSelector.jsx";
import DescriptionGenerator from "./SpecsBuilder/DescriptionGenerator.jsx";

const SpecsBuilder = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFormulaName, setCurrentFormulaName] = useState(null);

    const loadFormulaLink = async () => {
        try {
            setLoading(true);
            const res = await fetchGetData("/service/desc-builder/fetch_formula_link");
            if (res && res.entity_type) {
                setCurrentFormulaName(res.entity_type.title_type);
                setSelected(res.entity_type.id);
            }
        } catch (e) {
            console.error(e);
            setError("Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadFormulaLink();
    }, []);

    const {
        loading: typesLoading,
        types,
        selected,
        setSelected,
        error: typesError,
        updateFormulaLink
    } = useFormulaTypeSelector(true);

    if (loading) return <div style={{padding: 20}}><Spin/> Загрузка…</div>;
    if (error) return <>Ошибка: {error}</>;

    return (
        <>
            <div style={{display: "flex", justifyContent: "flex-start"}}>
                <div style={{width: "30%"}}>
                    <FormulaTypeSelector
                        currentFormulaName={currentFormulaName}
                        typesLoading={typesLoading}
                        types={types}
                        selected={selected}
                        setSelected={setSelected}
                        typesError={typesError}
                        updateFormulaLink={updateFormulaLink}
                        onUpdated={(newName) => {
                            setCurrentFormulaName(newName);
                        }}
                    />
                </div>
            </div>
            <DescriptionGenerator formulaId={selected}/>
        </>
    );
};

export default SpecsBuilder;
