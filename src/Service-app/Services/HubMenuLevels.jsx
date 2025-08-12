import {useEffect, useState, useCallback, useMemo} from "react";
import {Tree, Spin, Button} from "antd";
import {
    addHubLevel, ComparisonStockItems,
    deleteHubLevel,
    fetchHubLevels,
    renameHubLevel,
    updateHubItemPosition
} from "./HubMenuLevels/api.js";
import StockHubItemsTable from "./HubMenuLevels/StockHubItemsTable.jsx";
import TreeDataRender from "./HubMenuLevels/TreeRender.jsx";
import { ReloadOutlined } from "@ant-design/icons";
import ComparisonModal from "./HubMenuLevels/ComparisonModal.jsx";

const HubMenuLevels = ({onSelectPath = () => {}}) => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [tempLabel, setTempLabel] = useState("");
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [activePathId, setActivePathId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [comparisonResult, setComparisonResult] = useState("");


    const loadLevels = useCallback(async () => {
        const data = await fetchHubLevels();
        setMenuData(data.map(item => ({
            ...item,
            parentId: item.parent_id ?? 0
        })));
        setLoading(false);
    }, []);

    useEffect(() => {
        loadLevels();
    }, [loadLevels]);

    const handleSelect = useCallback((selectedKeys) => {
        const key = selectedKeys.length ? parseInt(selectedKeys[0], 10) : null;
        setActivePathId(key);
        onSelectPath(key);
    }, [onSelectPath]);

    const handleSubmitLabel = async (key, newLabel) => {
        setEditingKey(null);
        const trimmed = newLabel.trim();
        if (!trimmed) {
            setMenuData(prev => prev.filter(item => item.id !== key));
            return;
        }

        const placeholder = menuData.find(item => item.id === key && item.isNew);
        if (placeholder) {
            const {status} = await addHubLevel(placeholder.parentId, trimmed);
            if (status === "created") await loadLevels();
        } else {
            if (key === 1) return;
            const {status, new_label} = await renameHubLevel(key, trimmed);
            if (status === "renamed") {
                setMenuData(prev =>
                    prev.map(item =>
                        item.id === key ? {...item, label: new_label} : item
                    )
                );
            }
        }
    };

    const handleAddLevelUI = (node) => {
        const nextIndex = menuData.filter(n => n.parentId === node.id).length + 1;
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
        setExpandedKeys(prev => [...new Set([...prev, node.id.toString()])]);
    };

    const handleDeleteNode = async (id) => {
        const {status} = await deleteHubLevel(id);
        if (status === "deleted") await loadLevels();
    };

    const onDrop = async (info) => {
        const dragId = parseInt(info.dragNode.key, 10);
        const dropId = parseInt(info.node.key, 10);
        const dropPos = info.dropPosition;

        if (!info.dropToGap && dropPos === 0) return;

        const dragNode = menuData.find(n => n.id === dragId);
        if (!dragNode) return;

        const sameLevel = menuData
            .filter(n => n.parentId === dragNode.parentId)
            .filter(n => n.id !== dragId)
            .sort((a, b) => a.sort_order - b.sort_order);

        const baseIndex = Math.max(sameLevel.findIndex(n => n.id === dropId), 0);
        const insertionIndex = dropPos < 0 ? baseIndex : baseIndex + 1;

        const reordered = [...sameLevel];
        reordered.splice(insertionIndex, 0, dragNode);

        const dragIndex = reordered.findIndex(n => n.id === dragId);
        const afterId = dragIndex > 0 ? reordered[dragIndex - 1].id : null;

        const response = await updateHubItemPosition(dragId, dragNode.parentId, afterId);
        if (response.status === "updated") await loadLevels();
    };

    const treeContext = {
        editingKey,
        tempLabel,
        setEditingKey,
        setTempLabel,
        handleSubmitLabel,
        handleDeleteNode,
        handleAddLevelUI,
    };

    const treeData = useMemo(() => TreeDataRender({menuData, treeContext}), [menuData, treeContext]);


    const handleUpdateDateBtn = async () => {
        if (!activePathId) return;

        const origins = selectedItems.map(item => item.origin);

        try {
            const payload = {
                path_id: activePathId,
                origins: origins
            };
            const result = await ComparisonStockItems(payload);
            setComparisonResult(JSON.stringify(result, null, 2));
            setModalVisible(true);
        } catch (error) {
            setComparisonResult("Ошибка при сравнении: " + error.message);
            setModalVisible(true);
        }
    };




    return loading ? (
        <div style={{padding: 24, textAlign: "center"}}>
            <Spin tip="Загрузка уровней" size="large"/>
        </div>
    ) : (
        <>
            <Tree
                draggable
                blockNode
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                treeData={treeData}
                onDrop={onDrop}
                onSelect={handleSelect}
            />
            {activePathId != null && (
                <StockHubItemsTable
                    pathId={activePathId} onSelectedOrigins={setSelectedItems}
                />
            )}
            {activePathId != null && (
                <div style={{paddingTop: 10}}>
                    <Button icon={<ReloadOutlined />}
                            type="text"
                            onClick={() => handleUpdateDateBtn()}>
                        Обновить данные
                    </Button>
                </div>
            )}
            <ComparisonModal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                content={comparisonResult}
            />

        </>
    );
};

HubMenuLevels.componentTitle = "Хаб";
HubMenuLevels.componentIcon = <img src="/ui/levels.png" alt="icon" width="30" height="30"/>;
export default HubMenuLevels;
