import {useEffect, useState} from "react";
import {Tree, Spin} from "antd";
import {
    addHubLevel,
    deleteHubLevel,
    fetchHubLevels,
    renameHubLevel,
    updateHubItemPosition
} from "./HubMenuLevels/api.js";
import TreeRender from "./HubMenuLevels/TreeRender.jsx";


const HubMenuLevels = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [tempLabel, setTempLabel] = useState("");
    const [expandedKeys, setExpandedKeys] = useState([]);

    useEffect(() => {
        loadLevels();
    }, []);

    const loadLevels = async () => {
        const data = await fetchHubLevels();
        setMenuData(
            data.map(item => ({
                ...item,
                parentId: item.parent_id ?? 0
            }))
        );
        setLoading(false);
    };

    const handleSubmitLabel = async (key, newLabel) => {
        setEditingKey(null);

        if (!newLabel.trim()) {
            setMenuData(prev => prev.filter(item => item.id !== key));
            return;
        }
        const placeholder = menuData.find(item => item.id === key && item.isNew);
        if (placeholder) {
            const { status } = await addHubLevel(placeholder.parentId, newLabel.trim());
            if (status === "created") {
                await loadLevels();
            }
        } else {
            if (key === 1) return;
            const { status, new_label } = await renameHubLevel(key, newLabel.trim());
            if (status === "renamed") {
                setMenuData(prev =>
                    prev.map(item =>
                        item.id === key ? { ...item, label: new_label } : item
                    )
                );
            }
        }
    };

    const handleAddLevelUI = node => {
        const nextIndex = menuData
            .filter(n => n.parentId === node.id)
            .length + 1;
        const newKey = `new-${node.id}-${Date.now()}`;

        setMenuData(prev => [
            ...prev,
            {
                id: newKey,
                parentId: node.id,
                label: "",
                sort_order: nextIndex,
                isNew: true
            }
        ]);
        setTempLabel("");
        setEditingKey(newKey);
        setExpandedKeys(prev =>
            Array.from(new Set([...prev, node.id.toString()]))
        );
    };

    const onDrop = async info => {
        const dragId = parseInt(info.dragNode.key, 10);
        const dropId = parseInt(info.node.key, 10);
        const dropPos = info.dropPosition;

        if (!info.dropToGap && dropPos === 0) {
            return;
        }

        const dragNode = menuData.find(n => n.id === dragId);
        if (!dragNode) {
            return
        }

        const newParentId = dragNode.parentId;

        const sameLevel = menuData
            .filter(n => n.parentId === newParentId)
            .sort((a, b) => a.sort_order - b.sort_order);

        const filtered = sameLevel.filter(n => n.id !== dragId);
        const baseIndex = Math.max(filtered.findIndex(n => n.id === dropId), 0);

        const insertionIndex = dropPos < 0
            ? baseIndex
            : baseIndex + 1;

        const reordered = [...filtered];
        reordered.splice(insertionIndex, 0, dragNode);

        const dragIndex = reordered.findIndex(n => n.id === dragId);
        const afterId = dragIndex > 0 ? reordered[dragIndex - 1].id : null;

        const response = await updateHubItemPosition(dragId, newParentId, afterId);

        if (response.status === "updated") {
            const fresh = await fetchHubLevels();
            setMenuData(
                fresh.map(item => ({
                    ...item,
                    parentId: item.parent_id ?? 0
                }))
            );
        }
    };

    const handleDeleteNode = async id => {
        const { status} = await deleteHubLevel(id);
        if (status === "deleted") {
            const fresh = await fetchHubLevels();
            setMenuData(fresh.map(item => ({
                ...item,
                parentId: item.parent_id ?? 0
            })));
        }
    };

    return loading ? (
        <div style={{ padding: 24, textAlign: "center" }}>
            <Spin tip="Загрузка уровней" size="large" />
        </div>
    ) : (
        <Tree
            draggable
            blockNode
            expandedKeys={expandedKeys}
            onExpand={keys => setExpandedKeys(keys)}
            treeData={TreeRender(
                menuData,
                editingKey,
                tempLabel,
                setEditingKey,
                setTempLabel,
                handleSubmitLabel,
                handleDeleteNode,
                handleAddLevelUI
            )}
            onDrop={onDrop}
        />
    );
};

HubMenuLevels.componentTitle = "Структура Хаба";
HubMenuLevels.componentIcon = <img src="/ui/levels.png" alt="icon" width="30" height="30" />;
export default HubMenuLevels;