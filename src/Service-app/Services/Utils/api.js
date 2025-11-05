import axios from "axios";

export async function fetchHubLevelsWithPreview() {
    try {
        const response = await axios.get("/service/initial_hub_levels_with_preview");
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
}


export const loadingImage = async (code, pathname, file) => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("pathname", pathname);
    formData.append("file", file);

    try {
        const response = await axios.post("/service/loading_one_image", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
        throw error;
    }
};
