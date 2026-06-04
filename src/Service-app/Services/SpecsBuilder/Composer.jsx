import {Table, Button, message} from "antd";
import {useEffect, useState} from "react";
import {fetchGetData, fetchPostData, fetchPutData} from "../Common/api.js";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {PlusCircleOutlined} from "@ant-design/icons";
import {getSpecsPathColumns} from "./SpecsPathColumns.jsx";

const Composer = ({formulaEntityTypeId, selectedFormula, onEditFormula}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const [specPaths, setSpecPaths] = useState({});
    const [hoveredRow, setHoveredRow] = useState(null);

    const [isCreating, setIsCreating] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [createData, setCreateData] = useState(null);
    const [newRow, setNewRow] = useState({
        type_id: null,
        source: null,
        formula_id: null
    });

    useEffect(() => {
        if (!selectedFormula) return;
        const {id} = selectedFormula.formula;
        const {source} = selectedFormula;

        void loadSpecPaths(id, source);
    }, [selectedFormula]);

    const loadSpecPaths = async (formulaId, source) => {
        const res = await fetchPostData("/service/desc-builder/fetch_spec_path", {
            formula_id: formulaId,
            source
        });
        setSpecPaths(prev => ({...prev, [formulaId]: res || []}));
    };

    useEffect(() => {
        if (!formulaEntityTypeId) return;

        const load = async () => {
            setLoading(true);
            const res = await fetchGetData(`/service/desc-builder/fetch_composer/${formulaEntityTypeId}`);
            setData(res);
            setLoading(false);
        };

        void load();
    }, [formulaEntityTypeId]);

    if (loading) return <Spinner/>;


    const loadCreateData = async () => {
        const res = await fetchGetData(`/service/desc-builder/create_new_composer/${formulaEntityTypeId}`);
        setCreateData(res);
    };

    const startCreate = async () => {
        await loadCreateData();
        setIsCreating(true);
        setEditingRowId("new");
    };


    const onSave = async (record) => {
        if (!newRow.type_id || !newRow.source || !newRow.formula_id) {
            message.warning("Заполните все поля");
            return;
        }

        if (record.isNew) {
            await fetchPostData("/service/desc-builder/save_new_composer", newRow);
            message.success("Composer создан");
        } else {

            await fetchPutData(`/service/desc-builder/update_composer/${record.id}`, newRow);
            message.success("Composer обновлён");
        }

        await reloadTable();
        resetEditing();
    };

    const reloadTable = async () => {
        const updated = await fetchGetData(`/service/desc-builder/fetch_composer/${formulaEntityTypeId}`);
        setData(updated);
    };

    const resetEditing = () => {
        setIsCreating(false);
        setEditingRowId(null);
        setNewRow({type_id: null, source: null, formula_id: null});
    };


    const onEdit = (record) => {
        setEditingRowId(record.id);
        setNewRow({
            type_id: record.type.id,
            source: record.source,
            formula_id: record.formula.id
        });
    };


    const onCancel = () => resetEditing();

    const composers = data.composers || [];

    const tableData = isCreating
        ? [{id: "new", isNew: true, ...newRow}, ...composers]
        : composers;

    const columns = getSpecsPathColumns({
        createData,
        newRow,
        setNewRow,
        editingRowId,
        onSave,
        onCancel,
        onEdit,
        onEditFormula
    });

    return (
        <>

            {selectedFormula && (
                <Table
                    rowKey={(_, index) => index}
                    style={{marginTop: 15}}
                    dataSource={specPaths[selectedFormula.formula.id] || []}
                    pagination={false}
                    size="small"
                    columns={getSpecsPathColumns({})}
                    onRow={(_, index) => ({
                        onMouseEnter: () => setHoveredRow(index),
                        onMouseLeave: () => setHoveredRow(null)
                    })}
                    rowClassName={(_, index) =>
                        index === hoveredRow ? "spec-row-hover-red" : "spec-row-gray"
                    }
                />
            )}


            <Table
                rowKey="id"
                columns={columns}
                dataSource={tableData}
                pagination={false}
                size="small"
            />

            {!isCreating && (
                <div style={{marginTop: 10}}>
                    <Button type="primary" icon={<PlusCircleOutlined/>} onClick={startCreate}>
                        Создать новый composer
                    </Button>
                </div>
            )}
        </>
    );
};

export default Composer;
