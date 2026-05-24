import { useState, useMemo, useCallback } from "react";
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
            if (!rawPayload) {
                console.warn("loadInitialData: empty payload");
                setData([]);
                return;
            }

            // 1) Приводим к массиву
            let payloadArray;

            if (Array.isArray(rawPayload)) {
                payloadArray = rawPayload;
            } else if (typeof rawPayload === "object") {
                payloadArray = Object.values(rawPayload);
            } else {
                console.error("loadInitialData: invalid payload", rawPayload);
                setData([]);
                return;
            }

            // 2) Фильтруем undefined/null
            payloadArray = payloadArray.filter(Boolean);

            // 3) Чистим структуру
            const cleaned = payloadArray.map(path => ({
                path_id: path.path_id,
                route: Array.isArray(path.route) ? path.route : [],
                models: Array.isArray(path.models)
                    ? path.models.map(m => ({
                        id: m.id,
                        title: m.title,
                        info: m.info,
                        source: m.source,
                        type_: m.type_,
                        brand: m.brand,
                        in_hub: m.in_hub,
                        origins: Array.isArray(m.origins)
                            ? m.origins.map(o => ({
                                origin: o.origin,
                                title: o.title,
                                input_price: o.input_price,
                                output_price: o.output_price,
                                warranty: o.warranty,
                                vsl_id: o.vsl_id,
                                dt_parsed: o.dt_parsed,
                                profit_range: o.profit_range,
                                attrs: o.attrs ?? [],
                                pics: o.pics ?? [],
                                analyze: o.analyze ?? null
                            }))
                            : []
                    }))
                    : []
            }));

            setData(cleaned);

        } catch (e) {
            console.error("loadInitialData error", e);
            setData([]);
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
    const updateMarketParam = useCallback(async ({ path_id, scale, exponent }) => {
        try {
            const payload = {
                path_id,
                route: selectedPath.route,
                models: selectedPath.models,
                ...(scale !== undefined ? { market_variance_scale: scale } : {}),
                ...(exponent !== undefined ? { market_variance_exponent: exponent } : {})
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
                return { ok: false, message: "Нет выбранных origins" };
            }

            const res = await fetchPostData(
                "/service/update_origins_in_hubstock",
                payload
            );

            if (res !== false) {
                return { ok: true };
            }

            return { ok: false, message: "Ошибка при обновлении HubStock" };

        } catch (e) {
            console.error("commitToHubstock error:", e);
            return { ok: false, message: "Ошибка при обновлении HubStock" };
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
