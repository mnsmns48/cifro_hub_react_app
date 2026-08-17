import {useState, useCallback, useMemo} from "react";
import {message} from "antd";
import {fetchPostData} from "../../Common/api.js";
import {getSpecPathsTableColumns} from "../SpecPathsColumns.jsx";

export const useSpecPath = ({selectedFormula, onSpecPathChanged}) => {
    const [specPaths, setSpecPaths] = useState({});
    const [editingRowId, setEditingRowId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const emptyRow = {
        id: null,
        title: "",
        path: [],
        alias: "",
        in_filter: false
    };

    const [newRow, setNewRow] = useState(emptyRow);

    const formulaId = selectedFormula?.formula?.id;
    const source = selectedFormula?.source;

    // -----------------------------
    // LOAD
    // -----------------------------
    const loadSpecPaths = useCallback(async (formulaId, source) => {
        const res = await fetchPostData("/service/desc-builder/fetch_spec_path", {
            formula_id: formulaId,
            source
        });

        setSpecPaths(prev => ({
            ...prev,
            [formulaId]: Array.isArray(res) ? [...res] : []
        }));
    }, []);

    // -----------------------------
    // CREATE
    // -----------------------------
    const startCreateSpecPath = () => {
        setIsCreating(true);
        setEditingRowId("new");
        setNewRow(emptyRow);
    };

    // -----------------------------
    // SAVE
    // -----------------------------
    const onSave = async (record) => {
        if (!newRow.title || !newRow.path?.length) {
            message.warning("Заполните title и path");
            return;
        }

        if (record.isNew) {
            await fetchPostData("/service/desc-builder/create_spec_path", {
                formula_id: formulaId,
                source,
                title: newRow.title,
                path: newRow.path,
                alias: newRow.alias,
                in_filter: newRow.in_filter
            });
            message.success("Spec Path создан");
        } else {
            await fetchPostData("/service/desc-builder/update_spec_path", {
                id: record.id,
                title: newRow.title,
                path: newRow.path,
                alias: newRow.alias,
                in_filter: newRow.in_filter
            });
            message.success("Spec Path обновлён");
        }

        await loadSpecPaths(formulaId, source);
        onSpecPathChanged?.();
        resetEditing();
    };

    // -----------------------------
    // EDIT
    // -----------------------------
    const onEdit = (record) => {
        setEditingRowId(record.id);
        setNewRow({
            id: record.id,
            title: record.title,
            path: [...record.path],
            alias: record.alias ?? "",
            in_filter: record.in_filter ?? false
        });
    };

    // -----------------------------
    // DELETE
    // -----------------------------
    const onDelete = async (record) => {
        await fetchPostData("/service/desc-builder/delete_spec_path", {
            id: record.id
        });

        message.success("Spec Path удалён");

        await loadSpecPaths(formulaId, source);
        onSpecPathChanged?.();
    };

    // -----------------------------
    // RESET
    // -----------------------------
    const resetEditing = () => {
        setIsCreating(false);
        setEditingRowId(null);
        setNewRow(emptyRow);
    };

    const onCancel = () => resetEditing();

    // -----------------------------
    // TABLE DATA
    // -----------------------------
    const specPathTableData = useMemo(() => {
        const list = specPaths[formulaId] || [];

        if (isCreating) {
            return [{id: "new", isNew: true, ...newRow}, ...list];
        }

        return list;
    }, [specPaths, formulaId, isCreating, newRow]);

    // -----------------------------
    // ICON UPLOAD
    // -----------------------------
    const uploadIcon = async (record, file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
            `/service/desc-builder/spec_path/${record.id}/upload_icon`,
            {method: "POST", body: formData}
        );

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        message.success("Иконка обновлена");

        setSpecPaths(prev => {
            const updated = (prev[formulaId] || []).map(item =>
                item.id === record.id ? {...item, icon: data.icon} : item
            );
            return {...prev, [formulaId]: updated};
        });
    };

    const deleteIcon = async (record) => {
        const res = await fetch(
            `/service/desc-builder/spec_path/${record.id}/icon`,
            {method: "DELETE"}
        );

        if (!res.ok) throw new Error("Delete failed");

        const data = await res.json();
        message.success("Иконка удалена");

        setSpecPaths(prev => {
            const updated = (prev[formulaId] || []).map(item =>
                item.id === record.id ? {...item, icon: data.icon} : item
            );
            return {...prev, [formulaId]: updated};
        });
    };

    const onToggleFilter = async (record, checked) => {
        // локально обновляем UI
        setSpecPaths(prev => {
            const updated = (prev[formulaId] || []).map(item =>
                item.id === record.id ? { ...item, in_filter: checked } : item
            );
            return { ...prev, [formulaId]: updated };
        });

        // отправляем на бэкенд
        await fetchPostData("/service/desc-builder/update_spec_path", {
            id: record.id,
            title: record.title,
            path: record.path,
            alias: record.alias,
            in_filter: checked
        });

        // перезагружаем таблицу
        await loadSpecPaths(formulaId, source);
        onSpecPathChanged?.();
    };

    const specPathColumns = useMemo(
        () =>
            getSpecPathsTableColumns({
                editingRowId,
                onEdit,
                onSave,
                onCancel,
                onDelete,
                newRow,
                setNewRow,
                deleteIcon,
                uploadIcon,
                onToggleFilter
            }),
        [editingRowId, newRow]
    );

    return {
        specPathTableData,
        specPathColumns,
        startCreateSpecPath,
        loadSpecPaths
    };
};
