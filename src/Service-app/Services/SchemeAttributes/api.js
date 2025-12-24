import axios from "axios";

export async function fetchGetData(endpoint) {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом", error);
        return [];
    }
}