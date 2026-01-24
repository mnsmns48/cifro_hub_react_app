import {useCallback} from "react";

import {deleteStockItems} from "../HubMenuLevels/api.js";
import {clearMediaData, deleteParsingItems, reCalcOutputPrices} from "../PriceUpdater/api.js";


export const useParsingActions = ({
                                      setRows,
                                      setSelectedRowKeys,
                                      vslId,
                                      profitRangeId,
                                      setIsRefreshing
                                  }) => {

    const updateRow = useCallback((origin, patch) => {
        if (!origin || !patch) return;

        setRows(prev =>
            prev.map(row =>
                row.origin === origin
                    ? { ...row, ...patch }
                    : row
            )
        );
    }, [setRows]);

    const applyImageUpdate = useCallback((payload) => {
        const { origin, images, preview } = payload ?? {};
        if (!origin) return;

        updateRow(origin, { images, preview });
    }, [updateRow]);

    const handleDelete = useCallback(async (selectedRowKeys) => {
        if (!selectedRowKeys.length) return;

        await deleteParsingItems(selectedRowKeys);

        setRows(prev =>
            prev.filter(r => !selectedRowKeys.includes(r.origin))
        );

        setSelectedRowKeys([]);
    }, [setRows, setSelectedRowKeys]);

    const handleClearMedia = useCallback(async (origins) => {
        if (!origins.length) return;

        const cleared = await clearMediaData(origins);

        setRows(prev =>
            prev.map(row =>
                cleared.includes(row.origin)
                    ? {...row, pics: [], preview: null}
                    : row
            )
        );
    }, [setRows]);

    const handleClearFromHub = useCallback(async (originsToClear) => {
        if (!originsToClear.length) return;

        const deletedOrigins = await deleteStockItems({origins: originsToClear});
        if (!Array.isArray(deletedOrigins) || !deletedOrigins.length) return;

        setRows(prev =>
            prev.map(row =>
                deletedOrigins.includes(row.origin)
                    ? {...row, in_hub: false}
                    : row
            )
        );

        setSelectedRowKeys(prev =>
            prev.filter(origin => !deletedOrigins.includes(origin))
        );
    }, [setRows, setSelectedRowKeys]);

    const handleAddToHub = useCallback((updatedOrigins) => {
        if (!Array.isArray(updatedOrigins) || !updatedOrigins.length) return;

        setRows(prev =>
            prev.map(row =>
                updatedOrigins.includes(row.origin)
                    ? {...row, in_hub: true}
                    : row
            )
        );

        setSelectedRowKeys([]);
    }, []);

    const refreshParsingResult = useCallback(async () => {
        setIsRefreshing(true);
        setSelectedRowKeys([]);

        try {
            const updated = await reCalcOutputPrices(vslId, profitRangeId);
            setRows(Array.isArray(updated.parsing_result) ? updated.parsing_result : []);
        } finally {
            setIsRefreshing(false);
        }
    }, [vslId, profitRangeId, setRows, setSelectedRowKeys, setIsRefreshing]);

    return {
        updateRow,
        applyImageUpdate,
        handleDelete,
        handleClearMedia,
        handleClearFromHub,
        handleAddToHub,
        refreshParsingResult
    };
};