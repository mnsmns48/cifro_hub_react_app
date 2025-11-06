import axios from "axios";

export async function fetchLevelsWithPreview(endpoint) {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
}


export const loadingImage = async (code, file, endpoint) => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("file", file);
    try {
        const response = await axios.post(endpoint, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
        throw error;
    }
};


export const UpdateOrDeleteImage = async (payload, endpoint) => {
    try {
        const response = await axios.post(endpoint, payload);
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении или удалении иконки:", error);
        return null;
    }
};
