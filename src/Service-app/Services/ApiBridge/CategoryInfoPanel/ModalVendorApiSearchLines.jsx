import {useEffect, useState, useMemo} from "react";
import {Modal, Spin, Input, Table, Tooltip} from "antd";
import {fetchGetData} from "../../Common/api.js";
import {getModalVendorApiSearchLinesColumns} from "./ModalVendorApiSearchLinesColumns.jsx";
import {AppstoreAddOutlined} from "@ant-design/icons";

const ModalVendorApiSearchLines = ({open, onClose, apiSearchId, vendorId}) => {

    const [loading, setLoading] = useState(true);
    const [allVSL, setAllVSL] = useState([]);
    const [linkedVSL, setLinkedVSL] = useState([]);
    const [search, setSearch] = useState("");
    const [newRow, setNewRow] = useState(null);
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
        setNewRow(prev => ({ ...prev, [field]: value }));
    };

    const handleUndo = () => {
        setNewRow(null);
    };

    const handleSaveNew = () => {
        console.log("SAVE NEW VendorSearchLine:", newRow);
    };


    const dataColumns = getModalVendorApiSearchLinesColumns(
        isLinked,
        newRow,
        updateNewRow,
        handleSaveNew,
        handleUndo,
        brandsList
    );

    const tableData = newRow ? [newRow, ...filteredVSL] : filteredVSL;

    return (
        <Modal open={open}
               onCancel={onClose}
               footer={null}
               width={900}
               title="Vendor Search Lines">
            {loading && <Spin/>}
            {!loading && (
                <div>
                    <Input placeholder="Поиск по названию..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           style={{marginBottom: 8}}/>
                    <Tooltip title="Создать новую VendorSearchLine">
                        <AppstoreAddOutlined style={{fontSize: 22, color: "#555555", marginBottom: 8}}
                                             onClick={handleCreateNew}/>
                    </Tooltip>
                    <Table dataSource={tableData} columns={dataColumns} rowKey="id" size="small"
                           pagination={false} scroll={{y: 400}}/>
                </div>
            )}
        </Modal>
    );
};

export default ModalVendorApiSearchLines;
