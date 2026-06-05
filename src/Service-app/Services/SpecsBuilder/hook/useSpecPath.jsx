import {useState} from "react";
import {message} from "antd";
import {fetchPostData} from "../../Common/api.js";
import {getSpecPathsTableColumns} from "../SpecPathsColumns.jsx";

export const useSpecPath = ({selectedFormula, onSpecPathChanged}) => {
    const [specPaths, setSpecPaths] = useState({});
    const [editingRowId, setEditingRowId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const [newRow, setNewRow] = useState({
        id: null,
        title: "",
        path: []
    });


    const loadSpecPaths = async (formulaId, source) => {
        const res = await fetchPostData("/service/desc-builder/fetch_spec_path", {
            formula_id: formulaId,
            source
        });
        setSpecPaths(prev => ({...prev, [formulaId]: res || []}));
    };


    const startCreateSpecPath = () => {
        setIsCreating(true);
        setEditingRowId("new");
        setNewRow({
            id: null,
            title: "",
            path: []
        });
    };


    const onSave = async (record) => {
        const formulaId = selectedFormula.formula.id;
        const source = selectedFormula.source;

        if (!newRow.title || !newRow.path?.length) {
            message.warning("Заполните title и path");
            return;
        }

        if (record.isNew) {
            await fetchPostData("/service/desc-builder/create_spec_path", {
                formula_id: formulaId,
                source,
                title: newRow.title,
                path: newRow.path
            });
            message.success("Spec Path создан");
        } else {
            await fetchPostData("/service/desc-builder/update_spec_path", {
                id: record.id,
                title: newRow.title,
                path: newRow.path
            });
            message.success("Spec Path обновлён");
        }
        await loadSpecPaths(formulaId, source);
        onSpecPathChanged?.();
        resetEditing();
    };


    const onEdit = (record) => {
        setEditingRowId(record.id);
        setNewRow({
            id: record.id,
            title: record.title,
            path: record.path
        });
    };


    const onDelete = async (record) => {
        await fetchPostData("/service/desc-builder/delete_spec_path", {
            id: record.id
        });
        message.success("Spec Path удалён");
        const formulaId = selectedFormula.formula.id;
        const source = selectedFormula.source;
        await loadSpecPaths(formulaId, source);
        onSpecPathChanged?.();
    };

    const resetEditing = () => {
        setIsCreating(false);
        setEditingRowId(null);
        setNewRow({
            id: null,
            title: "",
            path: []
        });
    };

    const onCancel = () => resetEditing();

    const formulaId = selectedFormula?.formula?.id;

    const specPathTableData = isCreating
        ? [{id: "new", isNew: true, ...newRow}, ...(specPaths[formulaId] || [])]
        : (specPaths[formulaId] || []);


    const specPathColumns = getSpecPathsTableColumns({
        editingRowId,
        onEdit,
        onSave,
        onCancel,
        onDelete,
        newRow,
        setNewRow
    });

    return {
        specPathTableData,
        specPathColumns,
        startCreateSpecPath,
        loadSpecPaths
    };
};
