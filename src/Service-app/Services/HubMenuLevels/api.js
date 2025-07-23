import axios from "axios";


export const fetchHubLevels = async () => {
    try {
        const response = await axios.get("/service/initial_hub_levels");
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
};

export const renameHubLevel = async (id, newLabel) => {
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