import {fetchLevelsWithPreview} from "./api.js";


export const fetchLevels = async (config) => {
    const raw = await fetchLevelsWithPreview(config.endpoint);
    const {keyMap} = config;

    raw.forEach(item => {
        Object.entries(keyMap).forEach(([fromKey, toKey]) => {
            if (fromKey in item) {
                item[toKey] = item[fromKey];
            }
        });
    });

    return raw.sort((a, b) => {
        if (a.parent_id !== b.parent_id) {
            return a.parent_id - b.parent_id;
        }
        return a.sort_order - b.sort_order;
    });

};

export const uploadIcon = async (config, originId, file) => {
    try {
        const response = await config.uploadHandler(originId, file);

        const url = Array.isArray(response.url)
            ? response.url.find(item => item.name === response.filename)?.url
            : response.url;

        if (response?.filename && url) {
            return {filename: response.filename, url};
        }

        return null;
    } catch (error) {
        console.error("Ошибка при загрузке иконки:", error);
        return null;
    }
};

export const updateAndDeleteIcon = async (config, record, filename) => {

    const result = await config.updateHandler({code: record.id, icon: filename});
    if (!result) return null;

    const {icon, url} = result;

    if (icon === null) {
        return {icon: null, filename: ""};
    }

    if (url === null) {
        return {icon: record.icon ?? null, filename: icon || ""};
    }

    return {icon: url, filename: icon || ""};
};

