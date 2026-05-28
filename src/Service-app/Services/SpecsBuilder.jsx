import {useEffect, useState} from "react";
import {fetchGetData} from "./Common/api.js";

const SpecsBuilder = () => {
    const [loading, setLoading] = useState(true);
    const [exists, setExists] = useState(null);
    const [error, setError] = useState(null);

    const loadFormulaLink = async () => {
        try {
            setLoading(true);
            const res = await fetchGetData("/service/desc-builder/fetch_formula_link");
            setExists(res === true);
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

    if (loading) return <>Загрузка…</>;
    if (error) return <>Ошибка: {error}</>;

    return (
        <>
            {exists
                ? "Связь с типом формул найдена ✔"
                : "Связь с типом формул отсутствует ✖"
            }
        </>
    );
};

export default SpecsBuilder;
