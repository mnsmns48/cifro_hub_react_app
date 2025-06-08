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

export const startParsingProcess = async ({selectedRow, progress}) => {
    try {
        const parsingResult = await axios.post("/service/start_parsing",
            {vsl_id: selectedRow.id, vsl_url: selectedRow.url, progress});
        return parsingResult.data
    } catch (error) {
        console.error("Ошибка в Parsing Process", error);
    }
}

export const fetchPreviousParsingResults = async (id) => {
    try {
        const response = await axios.get(`/service/previous_parsing_results${id}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении предыдущих результатов:", error);
        throw error;
    }
};