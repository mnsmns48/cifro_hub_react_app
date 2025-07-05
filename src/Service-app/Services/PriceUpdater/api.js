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
        console.error('Ошибка загрузки /get_vsl/${vendorId}:', error);
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
        await axios.post(
            "/service/update_parsing_item_dependency/",
            data, {headers: {"Content-Type": "application/json"}}
        );
    } catch (err) {
        const msg = err.response?.data?.detail || err.message;
        throw new Error(msg);
    }
}

export async function fetchDependencyDetails(origin) {
    try {
        return await fetch(`/service/load_dependency_details/${origin}`, {
            method: "GET",
            headers: {Accept: "application/json"},
        }).then(res => res.json());
    } catch (error) {
        console.error("Ошибка запроса:", error);
    }
}

export const getUploadedImages = async (originCode) => {
    const response = await axios.get(`/service/fetch_images_62701/${originCode}`);
    return response.data;
};

export const reCalcOutputPrices = async (vsl_id, range_id) => {
    console.log(vsl_id, range_id);
    const response = await axios.post("/service/recalculate_output_prices", {vsl_id, range_id});
    return response.data;
};