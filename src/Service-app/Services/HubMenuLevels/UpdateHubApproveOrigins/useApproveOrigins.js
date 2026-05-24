import {useState, useMemo, useCallback} from "react";
import {
    getSelectedPath,
    getSelectedModel,
    getFlatOriginsWithoutPics
} from "./selectors";

import {
    updatePathInData,
    updateOriginInData,
    buildHubStockPayload,
    findOrigin
} from "./helpers";
import {fetchPostData} from "../../Common/api.js";


export function useApproveOrigins() {

    // -----------------------------
    // SERVER STATE
    // -----------------------------
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // UI CONTEXT STATE
    // -----------------------------
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [openedImageModalOrigin, setOpenedImageModalOrigin] = useState(null);
    const [showWithoutPics, setShowWithoutPics] = useState(false);

    // -----------------------------
    // UI SELECTION STATE
    // -----------------------------
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    // ============================================================
    // 1. INITIAL LOAD
    // ============================================================
    async function loadInitialData(rawPayload) {
        try {
            setLoading(true);

            // 1. Превращаем объект в массив, исключая sortOrderPathId
            const entries = Object.entries(rawPayload)
                .filter(([key]) => key !== "sortOrderPathId")
                .map(([_, value]) => value);

            // 2. Порядок path_id, который пришёл с бэка
            const order = rawPayload.sortOrderPathId || [];

            // 3. Сортируем paths по этому порядку
            const sorted = entries.sort((a, b) => {
                return order.indexOf(a.path_id) - order.indexOf(b.path_id);
            });

            // 4. Кладём в состояние
            setData(sorted);

            // 5. Автовыбор первого path и первой модели
            if (sorted.length > 0) {
                const firstPath = sorted[0];
                setSelectedPathId(firstPath.path_id);

                if (Array.isArray(firstPath.models) && firstPath.models.length > 0) {
                    setSelectedModelId(firstPath.models[0].id);
                }
            }

        } catch (e) {
            console.error("loadInitialData error", e);
        } finally {
            setLoading(false);
        }
    }


    // ============================================================
    // 2. DERIVED STATE
    // ============================================================
    const selectedPath = useMemo(
        () => getSelectedPath(data, selectedPathId),
        [data, selectedPathId]
    );

    const selectedModel = useMemo(
        () => getSelectedModel(selectedPath, selectedModelId),
        [selectedPath, selectedModelId]
    );

    const flatOriginsWithoutPics = useMemo(
        () => getFlatOriginsWithoutPics(data, selectedRowKeys),
        [data, selectedRowKeys]
    );


    // ============================================================
    // 3. UPDATE MARKET PARAM (scale/exponent)
    // ============================================================
    const updateMarketParam = useCallback(async ({path_id, scale, exponent}) => {
        try {
            const payload = {
                path_id,
                route: selectedPath.route,
                models: selectedPath.models,
                ...(scale !== undefined ? {market_variance_scale: scale} : {}),
                ...(exponent !== undefined ? {market_variance_exponent: exponent} : {})
            };

            const updatedPath = await fetchPostData(
                "/service/update_market_param",
                payload
            );

            if (!updatedPath) return;

            // update only this path in data
            setData(prev => updatePathInData(prev, updatedPath));

            // reset selection for this path based on new verdict
            const newVerdictKeys = updatedPath.models
                .flatMap(m => m.origins)
                .filter(o => o.analyze?.verdict === true)
                .map(o => o.origin);

            // remove old keys for this path
            const otherKeys = selectedRowKeys.filter(originId => {
                const origin = findOrigin(prevData, originId);
                return origin && origin.path_id !== path_id;
            });

            setSelectedRowKeys([...otherKeys, ...newVerdictKeys]);

        } catch (e) {
            console.error("updateMarketParam error:", e);
        }
    }, [selectedPath, selectedRowKeys]);


    // ============================================================
    // 4. UPDATE ORIGIN PICS
    // ============================================================
    const updateOriginPics = useCallback((originId, newPics) => {
        setData(prev => updateOriginInData(prev, originId, newPics));
    }, []);


    // ============================================================
    // 5. COMMIT TO HUBSTOCK
    // ============================================================
    const commitToHubstock = useCallback(async () => {
        try {
            const payload = buildHubStockPayload(data, selectedRowKeys);

            if (payload.length === 0) {
                return {ok: false, message: "Нет выбранных origins"};
            }

            const res = await fetchPostData(
                "/service/update_origins_in_hubstock",
                payload
            );

            if (res !== false) {
                return {ok: true};
            }

            return {ok: false, message: "Ошибка при обновлении HubStock"};

        } catch (e) {
            console.error("commitToHubstock error:", e);
            return {ok: false, message: "Ошибка при обновлении HubStock"};
        }
    }, [data, selectedRowKeys]);


    // ============================================================
    // RETURN API
    // ============================================================
    return {
        loading,
        data,

        selectedPath,
        selectedModel,
        flatOriginsWithoutPics,

        selectedPathId,
        setSelectedPathId,

        selectedModelId,
        setSelectedModelId,

        selectedRowKeys,
        setSelectedRowKeys,

        openedImageModalOrigin,
        setOpenedImageModalOrigin,

        showWithoutPics,
        setShowWithoutPics,

        loadInitialData,
        updateMarketParam,
        updateOriginPics,
        commitToHubstock
    };
}
