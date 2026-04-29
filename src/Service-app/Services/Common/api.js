import axios from "axios";

export async function fetchGetData(endpoint) {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом (GET)", error);
        return [];
    }
}

export async function fetchPostData(endpoint, payload = {}) {
    try {
        const response = await axios.post(endpoint, payload);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом (POST)", error);
        return null;
    }
}

export async function fetchPutData(endpoint, payload = {}) {
    try {
        const response = await axios.put(endpoint, payload);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом (PUT)", error);
        return null;
    }
}

export async function fetchDeleteData(endpoint) {
    try {
        const response = await axios.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("Проблема с бэкендом (DELETE)", error);
        return null;
    }
}