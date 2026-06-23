import {useEffect, useState, useMemo} from "react";
import {Modal, Spin, Input, Table, Tooltip, message, Button} from "antd";
import {fetchDeleteData, fetchGetData, fetchPostData, fetchPutData} from "../../Common/api.js";
import {getModalVendorApiSearchLinesColumns} from "./ModalVendorApiSearchLinesColumns.jsx";
import {FileAddOutlined, PullRequestOutlined, UndoOutlined} from "@ant-design/icons";
import axios from "axios";

const ModalVendorApiSearchLines = ({open, onClose, apiSearchId, vendorId, onVslChanged, onSaveParsingLines}) => {

    const [loading, setLoading] = useState(true);
    const [allVSL, setAllVSL] = useState([]);
    const [linkedVSL, setLinkedVSL] = useState([]);
    const [search, setSearch] = useState("");
    const [newRow, setNewRow] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [brandsList, setBrandsList] = useState([]);

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            try {
                const res = await fetchGetData(
                    `/service/api_bridge/vendor_api_search_line_link/${apiSearchId}`
                );

                setAllVSL(res.all_VSL || []);
                setLinkedVSL(res.linked_VSL || []);
            } catch (e) {
                console.error("load VSL error:", e);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        void load();
    }, [open, apiSearchId]);


    useEffect(() => {
        if (!open) return;

        const loadBrands = async () => {
            try {
                const res = await fetchGetData("/service/product/fetch_brands_list");
                setBrandsList(res || []);
            } catch (e) {
                console.error("load brands error:", e);
                setBrandsList([]);
            }
        };

        void loadBrands();
    }, [open]);


    const isLinked = (id) => {
        for (let i = 0; i < linkedVSL.length; i++) {
            if (linkedVSL[i].id === id) return true;
        }
        return false;
    };

    const toggleLink = async (vslId) => {
        const isAlreadyLinked = linkedVSL.some(v => v.id === vslId);

        try {
            if (isAlreadyLinked) {
                await axios.delete("/service/remove_link_vsl_api_search", {
                    data: {
                        api_search_id: apiSearchId,
                        vsl_id: vslId
                    }
                });
                const updated = linkedVSL.filter(v => v.id !== vslId);
                setLinkedVSL(updated);
                onVslChanged?.({
                    allVSL,
                    linkedVSL: updated
                });
            } else {
                await fetchPostData("/service/add_link_vsl_api_search", {
                    api_search_id: apiSearchId,
                    vsl_id: vslId
                });
                const updated = [...linkedVSL, {id: vslId}];
                setLinkedVSL(updated);
                onVslChanged?.({
                    allVSL,
                    linkedVSL: updated
                });
            }

        } catch (e) {
            message.error("Ошибка при изменении связи", e);
        }
    };



    const filteredVSL = useMemo(() => {
        if (!search.trim()) return allVSL;

        const s = search.toLowerCase();
        const result = [];

        for (let i = 0; i < allVSL.length; i++) {
            const v = allVSL[i];
            if (v.title.toLowerCase().includes(s)) {
                result.push(v);
            }
        }
        return result;
    }, [search, allVSL]);

    const handleCreateNew = () => {
        setNewRow({
            id: "__new",
            title: "",
            url: "",
            brands: [],
            dt_parsed: null,
            __isNew: true
        });
    };


    const updateNewRow = (field, value) => {
        setNewRow(prev => ({...prev, [field]: value}));
    };

    const handleUndo = () => {
        setNewRow(null);
    };

    const saveVSL = async (row, isNew) => {
        try {
            const payload = {
                ...(isNew ? {} : {id: row.id}),
                vendor_id: row.vendor_id ?? vendorId,
                title: row.title,
                url: row.url,
                brands: row.brands.map(id => {
                    const b = brandsList.find(x => x.id === id);
                    return {id: b.id, brand: b.brand};
                })
            };
            const updated = isNew
                ? await fetchPostData("/service/create_vsl_with_brand", payload)
                : await fetchPutData("/service/update_vsl_with_brand", payload);
            if (!isNew) setEditRow(null); onVslChanged?.();
            setAllVSL(prev => {
                if (isNew) return [updated, ...prev];
                return prev.map(v => (v.id === updated.id ? updated : v));
            });

            if (isNew) setNewRow(null); onVslChanged?.();
            message.success(isNew ? "Создано" : "Обновлено");
        } catch (e) {
            console.error("save VSL error:", e);

            let errMsg = isNew
                ? "Ошибка при создании VendorSearchLine"
                : "Ошибка при обновлении VendorSearchLine";

            if (e?.response?.data?.detail) errMsg = e.response.data.detail;
            else if (typeof e === "string") errMsg = e;
            else if (e?.message) errMsg = e.message;

            message.error(errMsg);
            if (isNew) setNewRow(null);
        }
    };

    const handleDelete = async (vslId) => {
        try {
            await fetchDeleteData(`/service/delete_vsl/${vslId}`);
            setAllVSL(prev => prev.filter(v => v.id !== vslId));
            onVslChanged?.();
            message.success("Удалено");
        } catch (e) {
            console.error("delete VSL error:", e);
            let errMsg = "Ошибка при удалении";
            if (e?.response?.data?.detail) errMsg = e.response.data.detail;
            else if (e?.message) errMsg = e.message;
            message.error(errMsg);
        }
    };


    const handleEdit = (record) => {
        setEditRow({
            ...record,
            __isEdit: true,
            brands: record.brands?.map(b => b.id) || []
        });
    };

    const updateEditRow = (field, value) => {
        setEditRow(prev => ({...prev, [field]: value}));
    };

    const handleSaveNew = () => saveVSL(newRow, true);
    const handleSaveEdit = () => saveVSL(editRow, false);
    const handleUndoEdit = () => setEditRow(null);


    const dataColumns = getModalVendorApiSearchLinesColumns(
        isLinked,
        toggleLink,
        newRow,
        updateNewRow,
        handleSaveNew,
        handleUndo,
        handleDelete,
        handleEdit,
        handleSaveEdit,
        updateEditRow,
        handleUndoEdit,
        brandsList
    );


    const linkedRows = filteredVSL.filter(v => linkedVSL.some(l => l.id === v.id));
    const unlinkedRows = filteredVSL.filter(v => !linkedVSL.some(l => l.id === v.id));

    let tableData = [...linkedRows, ...unlinkedRows];

    if (newRow) {
        tableData = [newRow, ...tableData];
    }

    if (editRow) {
        tableData = tableData.map(v =>
            v.id === editRow.id ? editRow : v
        );
    }



    return (
        <Modal open={open} onCancel={onClose} footer={null} width={1136} title="Vendor Search Lines">
            {loading && <Spin/>}
            {!loading && (
                <div>
                    <Input placeholder="Поиск по названию..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}/>

                    <Tooltip title={newRow ? "Отменить создание" : "Создать новую VendorSearchLine"}>
                        <Button size="small" type={newRow ? "default" : "primary"}
                                onClick={newRow ? handleUndo : handleCreateNew}
                                icon={newRow ? <UndoOutlined/> : <FileAddOutlined/>} style={{margin: "12px 0"}}>
                            {newRow ? "Отмена" : "Создать"}
                        </Button>
                    </Tooltip>

                    <Button size="small"
                            type="primary"
                            style={{margin: "12px 12px 0"}}
                            icon={<PullRequestOutlined/>}
                            onClick={() => onSaveParsingLines(linkedVSL)}>
                        Сохранить данные
                    </Button>


                    <Table dataSource={tableData} columns={dataColumns} rowKey="id" size="small"
                           pagination={false} scroll={{y: 400}}/>
                </div>
            )}
        </Modal>
    );
};

export default ModalVendorApiSearchLines;
