import axios from "axios";


export async function fetchHubLevels() {
    try {
        const response = await axios.get("/service/initial_hub_levels");
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
}

export async function renameHubLevel(id, newLabel) {
    try {
        const response = await axios.patch("/service/rename_hub_level", {
            id,
            new_label: newLabel
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при переименовании узла:", error);
        return {status: "error", message: "Не удалось переименовать узел"};
    }
}


export async function updateHubItemPosition(id, parentId, afterId = null) {
    try {
        const response = await axios.patch("/service/change_hub_item_position", {
            id,
            parent_id: parentId,
            after_id: afterId
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при изменении позиции узла:", error);
        return {status: "error", message: "Не удалось обновить позицию"};
    }
}

export async function addHubLevel(parentId, label = "Новый уровень") {
    try {
        const response = await axios.post("/service/add_hub_level", {
            parent_id: parentId,
            label
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении уровня:", error);
        return {status: "error", error};
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

export async function createHubLoading(payload) {
    try {
        const response = await axios.post('/service/load_items_in_hub', payload);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.detail || err.message;
            throw new Error(`Ошибка создания загрузки: ${msg}`);
        }
        throw err;
    }
}

export const renameHubObj = async (patch_data) => {
    try {
        const response = await axios.patch(`/service/rename_hubstock_obj_title`, patch_data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при переименовании товара:', error);
        throw error;
    }
};

export const recalcHubStockItems = async (patch_data) => {
    try {
        const response = await axios.patch(`/service/calc_hubstock_items`, patch_data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении цены товара:', error);
        throw error;
    }
};

export const deleteStockItems = async (payload) => {
    try {
        const response = await axios.delete(`/service/delete_stock_items`, {
            data: payload
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении товаров:', error);
        throw error;
    }
};

export const ComparisonStockItems = async (payload) => {
    const response = await axios.post(`/service/start_comparison_process`, payload);
    return response.data;
};


export const startParsing = async (payload) => {
    const response = await axios.post("/service/start_parsing", payload, {
        headers: {"Content-Type": "application/json"}
    });
    return response.data;
};

export const consentDataApiLoad = async (payload) => {
    const response = await axios.post(`/service/give_me_consent`, payload);
    return response.data;
};


export const comparisonRecomputedData = async (payload) => {
    const response = await axios.post(`/service/give_recomputed_output_prices`, payload);
    return response.data;
};

export const storeRecomputedData = async (payload) => {
    const response = await axios.patch(`/service/store_new_prices_hubstock_items`, payload);
    return response.data;
};