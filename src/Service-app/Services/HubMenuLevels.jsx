import {useEffect, useState} from "react";
import {Tree, Spin, Input} from "antd";
import {fetchHubLevels, renameHubLevel} from "./HubMenuLevels/api.js";

function buildTree(data, parentId = 0, editingKey, tempLabel, setEditingKey, setTempLabel, handleRename) {
    return data
        .filter(item => item.parentId === parentId)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(item => {
            const isEditing = editingKey === item.id;
            return {
                key: item.id.toString(),
                title: isEditing ? (
                    <Input
                        value={tempLabel}
                        size="small"
                        autoFocus
                        onChange={e => setTempLabel(e.target.value)}
                        onBlur={() => handleRename(item.id, tempLabel)}
                        onKeyDown={e => {
                            if (e.key === "Escape") {
                                setEditingKey(null);
                            } else if (e.key === "Enter") {
                                handleRename(item.id, tempLabel);
                            }
                        }}
                        style={{ width: "100%" }}
                    />
                ) : (
                    <span onDoubleClick={() => {
                        setEditingKey(item.id);
                        setTempLabel(item.label);
                    }}>
                        {item.label}
                    </span>
                ),
                children: buildTree(data, item.id, editingKey, tempLabel, setEditingKey, setTempLabel, handleRename),
                disableDrag: item.id === 1,
                disableDrop: item.id === 1
            };
        });
}

const HubMenuLevels = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [tempLabel, setTempLabel] = useState("");

    useEffect(() => {
        fetchHubLevels().then(data => {
            const normalized = data.map(item => ({
                ...item,
                parentId: item.parent_id ?? 0
            }));
            setMenuData(normalized);
            setLoading(false);
        });
    }, []);

    const onDrop = info => {
        const dragId = parseInt(info.dragNode.key);
        const dropId = parseInt(info.node.key);

        setMenuData(prev =>
            prev.map(item =>
                item.id === dragId ? { ...item, parentId: dropId } : item
            )
        );
    };

    const handleRename = async (id, newLabel) => {
        setEditingKey(null);
        if (!newLabel.trim()) return;

        const response = await renameHubLevel(id, newLabel.trim());
        if (response.status === "renamed") {
            setMenuData(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, label: response.new_label } : item
                )
            );
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
            treeData={buildTree(menuData, 0, editingKey, tempLabel, setEditingKey, setTempLabel, handleRename)}
            onDrop={onDrop}
        />
    );
};

HubMenuLevels.componentTitle = "Структура Хаба";
HubMenuLevels.componentIcon = <img src="/ui/levels.png" alt="icon" width="30" height="30" />;
export default HubMenuLevels;
