import {useState, useEffect} from "react";
import {message} from "antd";
import {fetchGetData, fetchPostData} from "../../Common/api.js";
import {getComposerColumns} from "../ComposerColumns.jsx";


export const useComposer = ({formulaEntityTypeId, onEditFormula}) => {
    const [data, setData] = useState(null);
    const [createData, setCreateData] = useState(null);
    const [isComposerCreating, setIsComposerCreating] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);

    const [newRow, setNewRow] = useState({
        type_id: null,
        source: null,
        formula_id: null
    });


    const reloadComposerTable = async () => {
        const res = await fetchGetData(`/service/desc-builder/fetch_composer/${formulaEntityTypeId}`);
        setData(res);
    };

    useEffect(() => {
        if (formulaEntityTypeId) void reloadComposerTable();
    }, [formulaEntityTypeId]);

    const loadCreateData = async () => {
        const res = await fetchGetData(`/service/desc-builder/create_new_composer/${formulaEntityTypeId}`);
        setCreateData(res);
    };

    const startCreateComposer = async () => {
        await loadCreateData();
        setIsComposerCreating(true);
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
            await fetchPostData("/service/desc-builder/update_composer", {
                id: record.id,
                ...newRow
            });
            message.success("Composer обновлён");
        }
        await reloadComposerTable();
        resetEditing();
    };

    const onEdit = async (record) => {
        await loadCreateData();
        setEditingRowId(record.id);
        setNewRow({
            type_id: record.type.id,
            source: record.source,
            formula_id: record.formula.id
        });
    };

    const onDelete = async (record) => {
        await fetchPostData(`/service/desc-builder/delete_composer/${record.id}`);
        message.success("Composer удалён");
        await reloadComposerTable();
    };

    const resetEditing = () => {
        setIsComposerCreating(false);
        setEditingRowId(null);
        setNewRow({type_id: null, source: null, formula_id: null});
    };

    const onCancel = () => resetEditing();

    const composers = data?.composers || [];

    const composerTableData = isComposerCreating
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
        onEditFormula
    });

    return {
        composerTableData,
        composerColumns,
        isComposerCreating,
        startCreateComposer,
        reloadComposerTable
    };
};
