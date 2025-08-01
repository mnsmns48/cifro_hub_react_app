import axios from "axios";


export async function fetchHubLevels () {
    try {
        const response = await axios.get("/service/initial_hub_levels");
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
};

export async function renameHubLevel (id, newLabel) {
    try {
        const response = await axios.patch("/service/rename_hub_level", {
            id,
            new_label: newLabel
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при переименовании узла:", error);
        return { status: "error", message: "Не удалось переименовать узел" };
    }
};


export async function updateHubItemPosition (id, parentId, afterId = null){
    try {
        const response = await axios.patch("/service/change_hub_item_position", {
            id,
            parent_id: parentId,
            after_id: afterId
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при изменении позиции узла:", error);
        return { status: "error", message: "Не удалось обновить позицию" };
    }
};

export async function addHubLevel(parentId, label = "Новый уровень") {
    try {
        const response = await axios.post("/service/add_hub_level", {
            parent_id: parentId,
            label
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении уровня:", error);
        return { status: "error", error };
    }
}

export async function deleteHubLevel(id) {
    try {
        const response = await axios.delete(`/service/delete_hub_level/${id}`);
        return response.data;
    } catch (error) {
        return {
            status: "error",
            error: error.response?.data || error.message
        };
    }
}

export async function fetchStockHubItems(pathId) {
    try {
        const response = await axios.get(`/service/fetch_stock_hub_items/${pathId}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке stock hub items:", error);
        return [];
    }
}

export async function createHubLoading({ vslId, dt_parsed, stocks }) {
    const payload = {
        vsl_id: vslId,
        dt_parsed: dt_parsed instanceof Date
            ? dt_parsed.toISOString()
            : dt_parsed,
        stocks: stocks.map(({ origin, pathId, warranty, outputPrice }) => ({
            origin,
            path_id: pathId,
            warranty,
            output_price: outputPrice,
        })),
    };

    try {
        const response = await axios.post('/service/items_to_hub_loadings', payload);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.detail || err.message;
            throw new Error(`Ошибка создания загрузки: ${msg}`);
        }
        throw err;
    }
}


export const renameOrChangePriceStockItem = async (payload) => {
    try {
        const response = await axios.patch(`/service/rename_or_change_price_stock_item`, payload);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
        throw error;
    }
};