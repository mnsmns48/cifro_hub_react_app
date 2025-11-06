import {fetchLevelsWithPreview} from "./api.js";
import {tableConfig} from "./tableconf.js";


export const fetchLevels = async (table) => {
    const config = tableConfig[table];
    if (!config) throw new Error(`Unknown table: ${table}`);

    const raw = await fetchLevelsWithPreview(config.endpoint);
    const {keyMap} = config;

    raw.forEach(item => {
        Object.entries(keyMap).forEach(([fromKey, toKey]) => {
            if (fromKey in item) {
                item[toKey] = item[fromKey];
            }
        });
    });

    const sortedData = raw.sort((a, b) => {
        if (a.parent_id !== b.parent_id) {
            return a.parent_id - b.parent_id;
        }
        return a.sort_order - b.sort_order;
    });
    console.log(sortedData)
    return sortedData;
};

export const uploadIcon = async (table, originId, file) => {
    const config = tableConfig[table];
    if (!config?.uploadHandler) return null;

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

export const updateAndDeleteIcon = async (table, record, filename) => {
    const config = tableConfig[table];
    if (!config?.updateHandler) return null;

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

