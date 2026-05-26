import {useState, useMemo, useCallback, useEffect} from "react";
import {
    getSelectedPath,
    getSelectedModel,
    getFlatOriginsWithoutPics, getSelectedRowKeysFromVerdict
} from "./selectors";

import {
    updatePathInData,
    updateOriginInData,
    buildHubStockPayload,
} from "./helpers";
import {fetchPostData} from "../../Common/api.js";


export function useApproveOrigins() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [openedImageModalOrigin, setOpenedImageModalOrigin] = useState(null);
    const [showWithoutPics, setShowWithoutPics] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    useEffect(() => {
        if (!selectedPathId || !data.length) return;

        const path = data.find(p => p.path_id === selectedPathId);
        if (!path) return;

        const newVerdictKeys = path.models
            .flatMap(m => m.origins)
            .filter(o => o.analyze?.verdict)
            .map(o => o.origin);

        setSelectedRowKeys(newVerdictKeys);

    }, [data, selectedPathId]);


    async function loadInitialData(rawPayload) {
        try {
            setLoading(true);
            const entries = Object.entries(rawPayload)
                .filter(([key]) => key !== "sortOrderPathId")
                .map(([, value]) => value);
            const order = rawPayload.sortOrderPathId || [];

            const sorted = entries.sort((a, b) => {
                return order.indexOf(a.path_id) - order.indexOf(b.path_id);
            });

            const res = await fetchPostData("/service/approve_origins_for_update", sorted);

            if (Array.isArray(res)) {
                setData(res);

                const verdictKeys = getSelectedRowKeysFromVerdict(res);
                setSelectedRowKeys(verdictKeys);

                if (res.length > 0) {
                    const firstPath = res[0];
                    setSelectedPathId(firstPath.path_id);

                    if (Array.isArray(firstPath.models) && firstPath.models.length > 0) {
                        setSelectedModelId(firstPath.models[0].id);
                    }
                }
            }

        } catch (e) {
            console.error("loadInitialData error", e);
        } finally {
            setLoading(false);
        }
    }

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


    const updateMarketParam = useCallback(async ({path_id, scale, exponent}) => {
        try {
            const payload = {
                path_id,
                route: selectedPath.route,
                models: selectedPath.models,
                ...(scale !== undefined ? {market_variance_scale: scale} : {}),
                ...(exponent !== undefined ? {market_variance_exponent: exponent} : {})
            };

            const updatedPath = await fetchPostData("/service/update_market_param", payload);
            if (!updatedPath) return;

            setData(prev => updatePathInData(prev, updatedPath));

        } catch (e) {
            console.error("updateMarketParam error:", e);
        }
    }, [selectedPath]);


    const updateOriginPics = useCallback((originId, newPics) => {
        setData(prev => updateOriginInData(prev, originId, newPics));
    }, []);


    ``
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


    function updateVerdictForCurrentPath(keys) {
        setData(prev =>
            prev.map(path =>
                path.path_id !== selectedPathId
                    ? path
                    : {
                        ...path,
                        models: path.models.map(model => ({
                            ...model,
                            origins: model.origins.map(o => ({
                                ...o,
                                analyze: {
                                    ...o.analyze,
                                    verdict: keys.includes(o.origin)
                                }
                            }))
                        }))
                    }
            )
        );
    }


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
        commitToHubstock,
        updateVerdictForCurrentPath
    };
}
