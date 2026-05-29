import {useEffect, useState} from "react";

import {message} from "antd";
import {fetchGetData, fetchPostData} from "../Common/api.js";

export function useFormulaTypeSelector(enabled) {
    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        const load = async () => {
            try {
                setLoading(true);
                const res = await fetchGetData("/service/formula-expression/fetch_entity_types");
                if (Array.isArray(res)) {
                    setTypes(res);
                }
            } catch (e) {
                console.error(e);
                setError("Ошибка загрузки типов формул");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    const updateFormulaLink = async (formula) => {
        try {
            setLoading(true);

            const res = await fetchPostData(
                "/service/desc-builder/update_formula_link",
                formula
            );
            if (res) {
                message.success("Формула обновлена");
            }
            return res;
        } catch (e) {
            message.error("Ошибка обновления связи", e);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        types,
        selected,
        setSelected,
        error,
        updateFormulaLink
    };
}
