import axios from "axios";


export const fetchVendors = async () => {
    try {
        const response = await axios.get('/service/vendors');
        return response.data.vendors?.map(vendor => ({
            value: String(vendor.id),
            label: vendor.name
        })) || [];
    } catch (error) {
        console.error('Ошибка загрузки данных', error);
        return [];
    }
};


export const fetchTableData = async (vendorId) => {
    try {
        const response = await axios.get(`/service/get_vsl/${vendorId}`);
        return response.data.vsl || [];
    } catch (error) {
        console.error('Ошибка загрузки fetchTableData', error);
        return [];
    }
};


export const addVSL = async (vendorId,
                             newVSLData,
                             refreshTableData,
                             setInputVSLink,
                             setInputTitle,
                             setSuccessMessage,
                             setIsSuccessModalOpen,
                             setErrorMessage,
                             setIsErrorModalOpen) => {
    if (!vendorId) return;

    try {
        const response = await axios.post(`/service/create_vsl/${vendorId}`, {
            id: 0,
            vendor_id: Number(vendorId), ...newVSLData
        });
        const newVsl = response.data.vsl;
        await refreshTableData(newVsl);
        setInputVSLink("");
        setInputTitle("");
        setSuccessMessage(`Ссылка "${newVsl.title}" успешно добавлена!`);
        setIsSuccessModalOpen(true);
    } catch (error) {
        if (error.response?.status === 409) {
            setErrorMessage("Ошибка: такая ссылка или название уже существует!");
        } else {
            setErrorMessage(`Ошибка добавления, проблема с сервером`);
        }
        setIsErrorModalOpen(true);
    }
};


export const getProgressLine = async () => {
    try {
        const progress_line_response = await axios.get("/give_progress_line");
        return progress_line_response.data
    } catch (error) {
        console.error("Ошибка запроса", error);
    }
}

export const startDataCollection = async ({selectedRow, progress, api_url, sync_features}) => {
    try {
        const parsingResult = await axios.post(api_url,
            {vsl_id: selectedRow.id, vsl_url: selectedRow.url, progress, sync_features: sync_features});
        return parsingResult.data
    } catch (error) {
        console.error("Ошибка в Parsing Process", error);
    }
}

export const updateParsingItem = async (origin, data) => {
    try {
        const response = await axios.put(`/service/update_parsing_item/${origin}`, data);
        return response.data;
    } catch (error) {
        console.error("Ошибка обновления:", error);
        return {is_ok: false, message: "Ошибка запроса"};
    }
};

export const clearMediaData = async (origins) => {
    try {
        const response = await axios.post("/service/clear-media-data", {
            origins: origins,
        });
        return response.data.cleared;
    } catch (error) {
        console.error("Ошибка при очистке медиа:", error);
        return [];
    }
};


export async function deleteParsingItems(origins) {
    const res = await fetch("/service/delete_parsing_items/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(origins),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Ошибка удаления");
    }
}

export async function fetchItemDependencies(origin) {
    try {
        const res = await axios.get(`/service/get_parsing_items_dependency_list/${origin}`);
        return res.data.items ?? [];
    } catch (err) {
        const msg =
            err.response?.data?.detail ||
            err.message ||
            "Ошибка при получении зависимостей";
        throw new Error(msg);
    }
}

export async function postDependencyUpdate(data) {
    try {
        const payload = Array.isArray(data) ? data : [data];
        await axios.post(
            "/service/update_parsing_item_dependency/",
            {items: payload},
            {headers: {"Content-Type": "application/json"}}
        );
    } catch (err) {
        const msg = err.response?.data?.detail || err.message;
        throw new Error(msg);
    }
}


export async function fetchDependencyDetails(origin) {
    try {
        const res = await fetch(`/service/load_dependency_details/${origin}`, {
            method: "GET",
            headers: {Accept: "application/json"},
        });

        if (!res.ok) {
            alert(`Ошибка от сервера: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        alert("Сервер недоступен. Проверьте подключение.");
        return null;
    }
}


export const reCalcOutputPrices = async (vslId, rangeId) => {
    const response = await axios.post("/service/recalculate_output_prices",
        {vsl_id: vslId, range_id: rangeId});
    return response.data;
};

export async function getUploadedImages(originCode) {
    const response = await axios.get(`/service/fetch_images_62701/${originCode}`);
    return response.data.images || [];
}


export const uploadImageToS3 = async (originCode, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`/service/upload_image/${originCode}`, formData);
    return response.data;
};

export async function deleteImageFromS3(origin, filename) {
    const res = await axios.delete(`/service/delete_images/${origin}/${filename}`);
    return res.data;
}

export const markImageAsPreview = async (origin, filename) => {
    try {
        const response = await axios.patch(`/service/set_is_preview_image/${origin}/${filename}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при установке превью", error);
    }
};

export const exportParsingToExcel = async (payload) => {
    const response = await axios.post("/service/get_price_excel", payload, {
        responseType: "blob"
    });

    const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers["content-disposition"];
    const match = disposition?.match(/filename="(.+)"/);
    link.download = match?.[1] || "export.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};


export const deleteDependencies = async (origins) => {
    const url = "/service/clear_features_dependencies";
    const response = await axios.delete(url, {data: {origins}});
    return response.data;
};