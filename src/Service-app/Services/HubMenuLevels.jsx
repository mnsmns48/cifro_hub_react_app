    import {useEffect, useState} from "react";
    import {Tree, Spin} from "antd";
    import {
        addHubLevel,
        deleteHubLevel,
        fetchHubLevels,
        renameHubLevel,
        updateHubItemPosition
    } from "./HubMenuLevels/api.js";
    import StockHubItemsTable from "./HubMenuLevels/StockHubItemsTable.jsx";
    import TreeDataRender from "./HubMenuLevels/TreeRender.jsx";


    const HubMenuLevels = ({ onSelectPath }) => {
        const [menuData, setMenuData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [editingKey, setEditingKey] = useState(null);
        const [tempLabel, setTempLabel] = useState("");
        const [expandedKeys, setExpandedKeys] = useState([]);
        const [fetchStockByPath, setFetchStockByPath] = useState(null);
        const [chooseStockPath, setChooseStockPath] = useState(null);


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

        const handleSelect = (selectedKeys) => {
            if (!selectedKeys.length) {
                setChooseStockPath(null);
                onSelectPath(null);
                return;
            }
            const key = parseInt(selectedKeys[0], 10);
            setChooseStockPath(key);
            onSelectPath(key);
        };

        const handleToggleStockTable = node => {
            const newPathId = fetchStockByPath === node.id ? null : node.id;
            setFetchStockByPath(prev =>
                prev === node.id ? null : node.id
            );
            setExpandedKeys(prev =>
                Array.from(new Set([...prev, node.id.toString()]))
            );
            if (onSelectPath) {
                onSelectPath(newPathId);
            }
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
            const { status } = await deleteHubLevel(id);
            if (status === "deleted") {
                const fresh = await fetchHubLevels();
                setMenuData(
                    fresh.map(item => ({ ...item, parentId: item.parent_id ?? 0 }))
                );
            }
        };

        const treeContext = {
            editingKey,
            tempLabel,
            setEditingKey,
            setTempLabel,
            handleSubmitLabel,
            handleDeleteNode,
            handleAddLevelUI,
            handleToggleStockTable,
            fetchStockByPath
        };

        const treeData = TreeDataRender({ menuData, treeContext });

        return loading ? (
            <div style={{ padding: 24, textAlign: "center" }}>
                <Spin tip="Загрузка уровней" size="large" />
            </div>
        ) : (
            <>
                <Tree
                    draggable
                    blockNode
                    expandedKeys={expandedKeys}
                    onExpand={keys => setExpandedKeys(keys)}
                    treeData={treeData}
                    onDrop={onDrop}
                    onSelect={handleSelect}

                />
                {fetchStockByPath && (
                    <StockHubItemsTable pathId={chooseStockPath} />
                )}
            </>
        );
    };

    HubMenuLevels.componentTitle = "Хаб";
    HubMenuLevels.componentIcon = <img src="/ui/levels.png" alt="icon" width="30" height="30" />;
    export default HubMenuLevels;