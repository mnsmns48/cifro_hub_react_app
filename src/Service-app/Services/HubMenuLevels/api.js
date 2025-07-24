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