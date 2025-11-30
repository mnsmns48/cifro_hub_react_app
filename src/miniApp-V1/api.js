import axios from "axios";

export async function getFetch(endpoint, data = null) {
    try {
        const config = data
            ? {
                params: data,
                paramsSerializer: params => {
                    const searchParams = new URLSearchParams();
                    Object.keys(params).forEach(key => {
                        const value = params[key];
                        if (Array.isArray(value)) {
                            value.forEach(v => searchParams.append(key, v));
                        } else {
                            searchParams.append(key, value);
                        }
                    });
                    return searchParams.toString();
                }
            }
            : {};
        const response = await axios.get(endpoint, config);
        return response.data;

    } catch (error) {
        console.error("Проблема с бэкендом при getFetch", error);
        return [];
    }
}
