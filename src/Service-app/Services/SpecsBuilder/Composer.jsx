import {Table, Button, message} from "antd";
import {useEffect, useState} from "react";
import {fetchGetData, fetchPostData, fetchPutData} from "../Common/api.js";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {PlusCircleOutlined} from "@ant-design/icons";
import {getComposerColumns} from "./ComposerColumns.jsx";
import {getSpecPathsTableColumns} from "./SpecPathsColumns.jsx";


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


    const onEdit = async (record) => {
        await loadCreateData();   // ← ДОБАВИТЬ
        setEditingRowId(record.id);
        setNewRow({
            type_id: record.type.id,
            source: record.source,
            formula_id: record.formula.id
        });
    };


    const onDelete = (record) => {

    }

    const onCancel = () => resetEditing();

    const composers = data.composers || [];

    const tableData = isCreating
        ? [{id: "new", isNew: true, ...newRow}, ...composers]
        : composers;

    const composerColumns = getComposerColumns({
        createData,
        newRow,
        setNewRow,
        editingRowId,
        onSave,
        onCancel,
        onEdit,
        onDelete,
        onEditFormula,
    });

    return (
        <>

            {selectedFormula && (
                <div
                    style={{
                        background: "#fafafa",
                        padding: "12px 12px 5px 12px",
                        borderRadius: 6,
                        marginTop: 5,
                        marginBottom: 25
                    }}
                >
                    <div style={{
                        display: "inline-block",
                        fontWeight: 600,
                        marginBottom: 8,
                        padding: "6px 10px",
                        background: "#3a3a3a",
                        border: "1px solid #d6e4ff",
                        borderRadius: 6,
                        color: "#e2fc2a",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}>
                        {selectedFormula.formula.name}
                    </div>

                    <Table
                        rowKey={(_, index) => index}
                        dataSource={specPaths[selectedFormula.formula.id] || []}
                        pagination={false}
                        size="small"
                        columns={getSpecPathsTableColumns()}
                        onRow={(_, index) => ({
                            onMouseEnter: () => setHoveredRow(index),
                            onMouseLeave: () => setHoveredRow(null)
                        })}
                        rowClassName={(_, index) =>
                            index === hoveredRow ? "spec-row-hover-red" : "spec-row-gray"
                        }
                    />
                </div>
            )}


            <Table
                rowKey="id"
                columns={composerColumns}
                dataSource={tableData}
                pagination={false}
                size="small"
            />

            {
                !isCreating && (
                    <div style={{marginTop: 10}}>
                        <Button type="primary" icon={<PlusCircleOutlined/>} onClick={startCreate}>
                            Создать новый composer
                        </Button>
                    </div>
                )
            }
        </>
    )
        ;

};

export default Composer;
